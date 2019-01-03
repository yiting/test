let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 垂直分割线
 */
module.exports.name = 'SPACER';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.canShareStyle = true; // 如果为简易元素，则不与其他结构复用样式
module.exports.isSimilar = function (a, b, config) {
    return a.width == b.width && a.height == b.height;
}
module.exports.is = function (dom, parent, config) {
    return dom.type == Dom.type.LAYOUT && dom.width < 3 && dom.height < config.dsl.fontSize * 1.4;
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
}