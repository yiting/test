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
module.exports.mixCount = 0;//-1，即为任意混合数
module.exports.template = function () {

}
module.exports.is = function (dom, parent, option, config) {
    return !dom.text && dom.path && (!dom.children || dom.children.length == 0)
}
module.exports.adjust = function (dom, parent, option, config) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
}