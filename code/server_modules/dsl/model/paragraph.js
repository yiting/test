let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 段落paragraph
 * 规则：多行纯文本
 */
module.exports.name = 'PARAGRAPH';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.isSimilar = function (a, b, config) {
    // 单元素不能有相似
    return false;
}
module.exports.is = function (dom, parent, config) {
    return dom.lines > 1;
}
module.exports.adjust = function (dom, parent, config) {
    dom.text = dom.text.replace(/ /img, '&nbsp;');
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    // dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
}