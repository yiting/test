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
module.exports.mixCount = -1; //-1，即为任意混合数
module.exports.isSimilar = function () {
    return false;
}
module.exports.canShareStyle = false;
module.exports.is = function (dom, parent, config) {
    // 判断：只有两个节点
    return !parent;
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedWidth.Default;
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Vertical;
    dom.contrains["LayoutPosition"] = Contrain.LayoutPosition.Static;

    return dom;
}