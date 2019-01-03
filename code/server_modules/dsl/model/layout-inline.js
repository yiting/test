let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 基础文本布局类型
 * 规则：左对齐or右对齐
 */
module.exports.name = 'LAYOUT-INLINE';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -20; //负值，即为任意混合数
module.exports.canShareStyle = true; // 如果为简易元素，则不与其他结构复用样式
module.exports.isSimilar = function (a, b, config) {
    return a.children.length == b.children.length &&
        a.children.every((d1, i) => {
            return d1.similarMarkId == b.children[i].similarMarkId;
        });
}
module.exports.is = function (dom, parent, config) {
    return (dom.layout == Dom.layout.BLOCK || dom.layout == Dom.layout.ROW) &&
        Dom.isHorizontal(dom.children) &&
        (
            dom.children.every(d => {
                let margin = Dom.calMargin(d, dom, 'x');
                return margin.left < config.dsl.horizontalSpacing;
            }) ||
            dom.children.every(d => {
                let margin = Dom.calMargin(d, dom, 'x');
                return margin.right < config.dsl.horizontalSpacing;
            })
        )
}
module.exports.adjust = function (dom, parent, config) {
    // dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Default;
    dom.contrains["LayoutPosition"] = Contrain.LayoutPosition.Static;
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Default;
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Horizontal;
}