let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 基础文本布局类型
 * 规则：任意
 */
module.exports.name = 'LAYOUT-TEXT';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 2;
module.exports.imageCount = 0;
module.exports.mixCount = -20; //负值，即为任意混合数
module.exports.canShareStyle = true;
module.exports.isSimilar = function (a, b, config) {
    return a.children.length == b.children.length &&
        a.children.every((d, i) => {
            return d.styles.maxSize == b.children[i].styles.maxSize &&
                a.lines == b.lines
        }) && (
            (Dom.isHorizontal(a.children) && Dom.isHorizontal(b.children)) ||
            (Dom.isVertical(a.children) && Dom.isVertical(b.children))
        )
}
module.exports.is = function (dom, parent, config) {
    return !(dom.path || dom.styles.border || dom.styles.background) &&
        dom.children.length && dom.children.every(child => child.type == Dom.type.TEXT);
    // return true;
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Default;
}