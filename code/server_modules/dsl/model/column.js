let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 聚合
 */
module.exports.name = 'COLUMN';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -10;//-1，即为任意混合数
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    return dom.layout == Dom.layout.COLUMN;
}
module.exports.adjust = function(dom, parent, option, config){
    let range = Dom.calRange(dom.children);
    if (dom.height > range.height) {
        dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
    }
    return true;
}