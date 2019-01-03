let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 基础布局类型
 * 规则：任意
 */
module.exports.name = 'LAYOUT';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -100; //-1，即为任意混合数
module.exports.canShareStyle = true;
module.exports.template = function () {

}
module.exports.is = function (dom, parent, config) {
    return false;
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
}