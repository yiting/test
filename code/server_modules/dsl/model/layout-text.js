let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 基础文本布局类型
 * 规则：任意
 */
module.exports.name = 'LAYOUT-TEXT';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -9; //负值，即为任意混合数
module.exports.template = function () {

}
module.exports.is = function (dom, parent, option, config) {
    return !(dom.path || dom.styles.border || dom.styles.background) &&
        dom.children.length && dom.children.every(child => child.type == Dom.type.TEXT);
    // return true;
}
module.exports.adjust = function (dom, parent, option, config) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Default;
}