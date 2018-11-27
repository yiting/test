const Contrain = require('../dsl_contrain.js');
const Dom = require("../dsl_dom.js");
/* 
    hom-image-layout
    类图布局
 */
module.exports.name = 'HOM-IMAGE-LAYOUT';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 0;
module.exports.imageCount = 1;
module.exports.mixCount = -1; //-1，即为任意混合数

module.exports.isSimilar = function (a,b) {

}
module.exports.is = function (dom, parent, config) {
    return (dom.layout == Dom.layout.Column ||
            dom.layout == Dom.layout.ROW) &&
        dom.children.length > 1 &&
        Dom.isHorizontal(dom.children)
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Horizontal;
    // 修正子节点
    dom.children.forEach((child, i) => {
        let margin = Dom.calMargin(child, dom);
        if (child.type == Dom.type.IMAGE) {
            child.contrains["LayoutFixWidth"] = Contrain.LayoutFixWidth.Fixed;
            child.contrains["LayoutFixHeight"] = Contrain.LayoutFixHeight.Fixed;
        }
        // 暂定右边比左边宽20px时，为flex布局
        if (margin.right - margin.left > config.dsl.horizontalSpacing) {
            child.contrains["LayoutFlex"] = Contrain.LayoutFlex.Auto;
        }
        // 暂定左边比右边宽时，为固定布局
        if (margin.left - margin.right > 20) {
            child.contrains["LayoutSelfHorizontal"] = Contrain.LayoutSelfHorizontal.Right;
        }
    });
}