let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 海报poster
 */
module.exports.name = 'SPACER';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.isSimilar = function () {

}
module.exports.is = function (dom, parent, config) {
    return dom.type == Dom.type.LAYOUT && dom.width < 3 && dom.height < config.dsl.fontSize * 1.4;
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
}