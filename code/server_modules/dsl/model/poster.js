let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 海报poster
 */
module.exports.name = 'POSTER';
module.exports.type = Dom.type.IMAGE;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -3; //-1，即为任意混合数
module.exports.template = function () {

}
module.exports.is = function (dom, parent, config) {
    // return dom.children && dom.children.length > 0 && (dom.path || (dom.styles && dom.styles.background))
    return dom.children && dom.children.length > 0 && dom.path;
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
}