let Dom = require("../dsl_dom.js");
let Contrain = require('../dsl_contrain.js');

/**
 * 文本
 * 规则：单行纯文本
 */
module.exports.name = 'TEXT';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.canShareStyle = false; // 如果为简易元素，则不与其他结构复用样式
module.exports.isSimilar = function (a, b,config) {
    return a.styles.maxSize == b.styles.maxSize;
}
module.exports.is = function (dom, parent, config) {
    if (dom.text && !dom.path && dom.lines == 1) {
        return true;
    }
}
module.exports.adjust = function (dom) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Default;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
}