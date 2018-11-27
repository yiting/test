let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 基础图片布局类型
 * 规则：任意
 */
module.exports.name = 'LAYOUT-IMAGE';
module.exports.type = Dom.type.IMAGE;
module.exports.textCount = 0;
module.exports.imageCount = 2;
module.exports.mixCount = -9; //负值，即为任意混合数
module.exports.template = function () {

}
module.exports.is = function (dom, parent, config) {
    return dom.children.length && dom.children.every(child => child.type == Dom.type.IMAGE);
}
module.exports.adjust = function (dom, parent, config) {

}