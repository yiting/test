let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 图片
 * 规则：拥有图片路径，没有子节点
 */

module.exports.name = 'IMAGE';
module.exports.type = Dom.type.IMAGE;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.canShareStyle = false; // 如果为简易元素，则不与其他结构复用样式

module.exports.isSimilar = function (a, b, config) {
    return a.width == b.width && a.height == b.height;
}
module.exports.is = function (dom, parent, config) {
    return !dom.text && dom.path;
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
}