const Common = require("./dsl_common.js");
const Dom = require("./dsl_dom.js");
const Store = require("./dsl_store.js");
const Logger = require("./logger.js");
/**
 * 重复结构分析
 */
let Option = {},
    Config = {}

function repeatRule(arr, logic, feature) {
    let pit = [];
    arr = arr.map((s, i) => {
        // 返回特征值
        return feature ? feature(s, i) : s;
    });
    arr.forEach((s, i) => {
        // 开始遍历
        for (let index = 0; index < i + 1; index++) {
            // 获取片段
            let fragment = arr.slice(index, i + 1);

            //    判断重复片段
            pit.some((p, pi) => {
                let isRepeat = fragment.every((f, fi) => {
                    return logic ? logic(f, p.feature[fi]) : (f == p.feature[fi]);
                });
                if (isRepeat) {
                    if (index >= p.lastIndex) {
                        p.count++;
                        p.indexs.push(index);
                        p.lastIndex = index;
                    }
                    return true;
                }
            }) || (pit.push({
                count: 1,
                lastIndex: index + fragment.length,
                feature: fragment,
                indexs: [index]
            }))
        }

    });
    return pit
}

function restructure(json, repeateItems) {
    // function restructure(json, rpItem) {
    repeateItems.forEach(rpItem => {
        let featureIndexs = rpItem.indexs,
            featureLength = rpItem.feature.length;
        featureIndexs.forEach(index => {
            // 提取节点组
            let newGroup = json.children.slice(index, index + featureLength)
            // 创建新节点
            let range = Dom.calRange(newGroup);
            let newDom = new Dom(range);
            newDom.type = Dom.type.LAYOUT;
            newDom.layout = Dom.layout.BLOCK;
            newDom.children = newGroup;
            newGroup.forEach(d => {
                d.x = d.abX - newDom.abX;
                d.y = d.abY - newDom.abY;
            });
            // 旧节点覆盖null
            json.children.fill(null, index, index + featureLength);
            json.children[index] = newDom;
        });
    })
    json.children = json.children.filter(dom => !!dom);
}


function fn(json) {
    // 深度遍历
    // json.children.forEach(child => {
    //     fn(child);
    // });

    let repeatArr = repeatRule(json.children,
        function (a, b) {
            return a == b;
        },
        function (d) {
            // 提取特征函数
            return [
                d.model || 'default',
                Math.round(d.width / 10) * 10
                // Math.round((d.abX + d.width / 2) / 10) * 10
            ].join('-')
        });
    let _indexsMap = new Array(json.children.length);
    let filterRepeatArr = repeatArr.sort((a, b) => {
        // 按重复长度降序排序
        return b.feature.length - a.feature.length;
    }).sort((a, b) => {
        return b.count - a.count;
    }).filter(s => {
        // 重复次数大于1 &&  && 重复节点是连续的
        const isRepeat = s.count > 1;
        const isContinues = s.indexs.every((index, i) => {
            return i == 0 || (index - s.feature.length) == s.indexs[i - 1]
        });
        return isRepeat && isContinues
    }).filter(s => {
        return s.indexs.every((index, i) => {
            let isRep = !_indexsMap[index];
            _indexsMap.fill(true, index, index + s.feature.length);
            return isRep
        });
    })
    console.log(filterRepeatArr)
    // let repeatItem = filterRepeatArr[0];
    // let repeatDoms = repeatItem.indexs.map(index => {
    //     return json.children.slice(index, index + repeatItem.feature.length).map(s => s.id)
    // }) 
    // console.log(json.id, repeatDoms);
    restructure(json, filterRepeatArr);

}
module.exports = function (data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}