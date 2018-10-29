let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * Body
 * 规则：无父节点
 */
module.exports.name = 'BODY';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -1;//-1，即为任意混合数
module.exports.template = function () {

}
module.exports.is = function (dom, parent, option, config) {
    // 判断：只有两个节点
    return !parent;
}
module.exports.adjust = function(dom, parent, option, config){
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedWidth.Default;
    dom.contrains["LayoutPosition"] = Contrain.LayoutPosition.Vertical;
    return dom;
}