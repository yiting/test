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

}
/**
 * 模型分析+处理
 */
function fn(dom) {
    if (dom.children) {
        // 从子孙节点开始遍历
        dom.children.forEach((child, i) => {
            fn(child);
            child.styleAuto = {};
            Models.inline.is(child, dom, Option, Config) ||
                Models.block.is(child, dom, Option, Config);

            // 先结构模型
            Models.textContain.is(child, dom, Option, Config) ||
                Models.image.is(child, dom, Option, Config) ||
                Models.text.is(child, dom, Option, Config) ||
                Models.paragraph.is(child, dom, Option, Config) ||
                Models.tag.is(child, dom, Option, Config) ||
                Models.iconEnter.is(child, dom, Option, Config) ||
                Models.legend.is(child, dom, Option, Config) ||
                Models.textButton.is(child, dom, Option, Config) ||
                Models.layoutEquality.is(child, dom, Option, Config)
                
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