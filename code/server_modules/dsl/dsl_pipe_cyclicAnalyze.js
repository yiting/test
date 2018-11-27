const Common = require("./dsl_common.js");
const Dom = require("./dsl_dom.js");
const Logger = require('./logger');
/**
 * 重复结构分析
 */

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
            console.log(newGroup)
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

function repeateLogic(a, b) {
    return a.model == b.model

}


function fn(json) {
    // 深度遍历
    json.children.forEach(child => {
        fn(child);
    });
    // 查找重复结构逻辑
    let repeatArr = Common.similarRule(json.children, repeateLogic);
    if (repeatArr.length) {
        Logger.debug(`[pipe - cyclic analyze] ${json.id}\t repeat items are:\n${repeatArr.map(s=>s.target.map(s=>'['+ s.map(t=>t.id).join()+']').join()).join('\n')}`)
    }
    // 重组【循环/重复节点】
    reStructure(json, repeatArr);

}
module.exports = function (data) {
    Logger.debug('[pipe - cyclic analyze] start')
    return fn(data);
}