let Common = require("./dsl_common.js");
let Models = {
    appStateNav: require("./model/appStateNav"),
    banner: require("./model/banner"),
    iconEnter: require("./model/iconEnter"),
    image: require("./model/image"),
    legend: require("./model/legend"),
    paragraph: require("./model/paragraph"),
    tag: require("./model/tag"),
    text: require("./model/text"),
    textButton: require("./model/textButton"),
    textContain: require("./model/textContain"),
    inline: require("./model/inline"),
    block: require("./model/block"),
    layoutEquality: require("./model/layoutEquality"),
    body: require("./model/body"),
    list0: require("./model/list0"),
    listHorizontalItem: require("./model/list-horizontal-item"),
    numerical: require("./model/numerical"),
    ul: require("./model/ul"),



}
/**
 * 模型分析+处理
 */
function fn(dom) {
    if (dom.children) {
        // 从子孙节点开始遍历
        dom.children.forEach((child, i) => {
            fn(child);
            [
                'ul',
                'inline',
                'block'
            ].some(c => { 
                return Models[c].is(child, dom, Option, Config)
            });       
            [
                'textContain',
                'image',
                'text',
                'paragraph',
                'tag',
                'iconEnter',
                'legend',
                'textButton',
                'numerical',
                'layoutEquality',
                'body',
                'listHorizontalItem',
                // 'list0'
            ].some(c => {
                return Models[c].is(child, dom, Option, Config)
            });
        });
    }
    return dom;
}

/**
 * 逻辑：组内左对齐，居中对齐为一列
 */
let Option = {
        deviationCoefficient: .05, // 偏差系数
    },
    Config = {}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}