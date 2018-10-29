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
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    return dom.layout == Dom.layout.INLINE;
}
module.exports.adjust = function(dom, parent, option, config){
    dom.contrains["LayoutPosition"] = Contrain.LayoutPosition.Horizontal;
    dom.contrains["LayoutJustifyContentStart"] = Contrain.LayoutJustifyContent.Start;
}