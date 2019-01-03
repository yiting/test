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
module.exports.mixCount = -20; //负值，即为任意混合数
module.exports.canShareStyle = true; // 如果为简易元素，则不与其他结构复用样式
module.exports.isSimilar = function (a, b, config) {
    // return a.children.length == b.children.length &&
    //     a.children.every((d1, i) => {
    //         return d1.similarMarkId == b.children[i].similarMarkId;
    //     });
    return a.height == b.height &&
        a.width == b.width &&
        Dom.isHorizontal(a.children) == Dom.isHorizontal(b.children) &&
        Dom.isVertical(a.children) == Dom.isVertical(b.children)

}
module.exports.canShareStyle = true;
module.exports.is = function (dom, parent, config) {
    return dom.children.length && dom.children.every(child => child.type == Dom.type.IMAGE);
}
module.exports.adjust = function (dom, parent, config) {

}