const Common = require("./dsl_common.js");
const Dom = require("./dsl_dom.js");
const Logger = require('./logger');
/**
 * 重复结构分析
 */
let Option = {},
    Config = {}

/**
 * 结构重组
 * @param {*} json 父节点
 * @param {*} repeateItems 重组信息
 */
function reStructure(json, repeateItems) {
    // 样式重复
    /* repeateItems.forEach(rpItem => {
        let templateStyles = null;
        rpItem.target.forEach(newGroup => {
            // 提取节点组
            if (!templateStyles) {
                // 如果不存在模板样式组，则返回模板样式
                templateStyles = newGroup.map(s => s.styles);
                return;
            }
            newGroup.forEach((d, i) => {
                d.styles = templateStyles[i];
            });
        });
    }); */
    // 结构重复
    repeateItems.forEach(rpItem => {
        let templateStyles = null;
        rpItem.target.map((newGroup) => {
            // 创建新节点
            if (newGroup.length < 2) {
                return;
            }
            let range = Dom.calRange(newGroup);
            let newDom = new Dom(range);
            newDom.type = Dom.type.LAYOUT;
            newDom.layout = Dom.layout.BLOCK;
            newDom.children = newGroup;
            newGroup.forEach(d => {
                d.x = d.abX - newDom.abX;
                d.y = d.abY - newDom.abY;
            });
            if (!templateStyles) {
                templateStyles = newDom.styles;
            } else {
                newDom.styles = templateStyles
            }
            // 插入新节点
            let insertIndex = json.children.indexOf(newGroup[0]);
            json.children.splice(insertIndex, 0, newDom);
            // 移除旧节点
            newGroup.forEach(dom => {
                const domIndex = json.children.indexOf(dom);
                json.children.splice(domIndex, 1);
            });
        });
    })
    json.children = json.children.filter(dom => !!dom);
}

function fn(json) {
    // 深度遍历
    json.children.forEach(child => {
        fn(child);
    });
    // 查找重复结构逻辑
    let repeatArr = Common.repeatRule(json.children,
        function (a, b) {
            return a.model == b.model;
        }
    );
    // 定义结构序列
    let _RepeatMap = [];
    // 筛选重复项
    let filterRepeatArr = repeatArr.sort((a, b) => {
        // 按最大公约重复因子-降序排序
        return b.feature.length - a.feature.length;
    }).sort((a, b) => {
        // 按最多重复数-降序排序
        return b.target.length - a.target.length;
    }).filter(s => {
        return s.target.every(target => {
            const existing = target.every(t => _RepeatMap.includes(t.id));
            if (!existing) {
                _RepeatMap.push(...target.map(t => t.id))
            }
            return !existing;
        })
    });
    if (filterRepeatArr.length) {
        Logger.debug(`[pipe - repeat analyze] ${json.id}\t repeat items are:\n${filterRepeatArr.map(s=>s.target.map(s=>'['+ s.map(t=>t.id).join()+']').join()).join('\n')}`)
    }
    // 重组【循环/重复节点】
    reStructure(json, filterRepeatArr);

}

/* function fn(json) {
    // 深度遍历
    // json.children.forEach(child => {
    //     fn(child);
    // });
    // 查找重复结构逻辑
    let repeatArr = Common.repeatRule(json.children,
        function (a, b) {
            return a.model == b.model;
        }
    );
    // 定义结构序列
    let _indexsMap = new Array(json.children.length);
    // 筛选重复项
    let filterRepeatArr = repeatArr.sort((a, b) => {
        // 按最大公约重复因子-降序排序
        return b.feature.length - a.feature.length;
    }).sort((a, b) => {
        // 按最多重复数-降序排序
        return b.count - a.count;
    }).filter(s => {
        // 重复次数大于1 &&  && 重复节点是连续的
        const isRepeat = s.count > 1;
        const isContinues = s.indexs.every((index, i) => {
            return i == 0 || (index - s.feature.length) == s.indexs[i - 1]
        });
        return isRepeat && isContinues
    }).filter(s => {
        return s.indexs.every(index => {
            // 去掉重复项
            const isRepeat = _indexsMap[index];
            _indexsMap.fill(true, index, index + s.feature.length);
            return !isRepeat
        });
    }); 
    if (filterRepeatArr.length) {
        Logger.debug(`[pipe - repeatAnalyze] ${json.id}\t repeat item indexs: ${filterRepeatArr.map(s=>s.indexs.join()).join()}`)
    }
    // 重组【循环/重复节点】
    reStructure(json, filterRepeatArr);

} */
module.exports = function (data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    Logger.debug('[pipe - repeat analyze] start')
    return fn(data);
}