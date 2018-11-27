let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 聚合
 */
module.exports.name = 'BLOCK';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -10; // -1，即为任意混合数
module.exports.isSimilar = function (a, b, config) {
    return false;
}
module.exports.is = function (dom, parent, config) {
    return dom.layout == Dom.layout.BLOCK || dom.layout == Dom.layout.ROW
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    let range = Dom.calRange(dom.children);
    if (dom.height > range.height) {
        dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
    }
    if (dom.text) {
        if (Math.abs(dir - d) < config.dsl.operateErrorCoefficient) {
            dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Center;
        } else if (d > dir) {
            dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.End;
        } else {
            dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Start;
        }
    }
}