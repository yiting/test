let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");

/**
 * 行内结构
 * 规则：
 */
module.exports.name = 'INLINE';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -10;//-1，即为任意混合数
module.exports.isSimilar = function () {
}
module.exports.is = function(dom, parent, config) {
    return dom.layout == Dom.layout.INLINE;
}
module.exports.adjust = function(dom, parent, config){
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Horizontal;
    dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Start;
}