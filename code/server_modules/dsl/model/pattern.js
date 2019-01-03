let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 图案PATTERN
 * 规则：无图片、无子节点的纯图案
 */

module.exports.name = 'PATTERN';
module.exports.type = Dom.type.IMAGE;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.canShareStyle = true; // 如果为简易元素，则不与其他结构复用样式
module.exports.isSimilar = function (a, b, config) {
    return a.width == b.width && a.height == b.height && (
        a.styles.background == b.styles.background &&
        a.styles.border == b.styles.border
    );
}
module.exports.is = function (dom, parent, config) {
    return dom.children.length == 0 &&
        !dom.text &&
        !dom.path &&
        (dom.styles.background || dom.styles.border);
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
}