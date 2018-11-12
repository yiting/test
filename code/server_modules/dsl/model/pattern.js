let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 图案PATTERN
 * 规则：无图片的纯色图案
 */

module.exports.name = 'PATTERN';
module.exports.type = Dom.type.IMAGE;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.template = function () {

}
module.exports.is = function (dom, parent, option, config) {
    return !dom.text && !dom.path && dom.styles.background;
}
module.exports.adjust = function (dom, parent, option, config) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
}