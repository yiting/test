const Contrain = require('../dsl_contrain.js');
const Dom = require("../dsl_dom.js");
/**
 * layout-list-item
 * 列表水平内容
 * 规则：盒模型，水平方向内容
 */
module.exports.name = 'LAYOUT-LIST-ITEM';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 1;
module.exports.imageCount = 1;
module.exports.mixCount = -1; //-1，即为任意混合数
module.exports.is = function (dom, parent, option, config) {
    return (dom.layout == Dom.layout.BLOCK ||
            dom.layout == Dom.layout.ROW) &&
        Dom.isHorizontal(dom.children)
}
module.exports.adjust = function (dom, parent, option, config) {
    dom.contrains["LayoutPosition"] = Contrain.LayoutPosition.Horizontal;
    // 修正子节点
    dom.children.forEach((child, i) => {
        let margin = Dom.calMargin(child, dom, 'x');
        /* if (child.type == Dom.type.IMAGE) {
            child.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
            child.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
            child.contrains["LayoutFlex"] = Contrain.LayoutFlex.None;
        } else {
            // 暂定右边比左边宽20px时，为flex布局
            if (margin.right - margin.left > config.dsl.horizontalSpacing) {
                child.contrains["LayoutFlex"] = Contrain.LayoutFlex.Auto;
            // child.contrains["LayoutSelfHorizontal"] = Contrain.LayoutSelfHorizontal.Left;
            }
            // 暂定左边比右边宽时，为固定布局
            if (margin.left - margin.right > config.dsl.horizontalSpacing) {
                child.contrains["LayoutSelfHorizontal"] = Contrain.LayoutSelfHorizontal.Right;
            }
        } */
        let dir = margin.right - margin.left;
        // 若右侧+自宽度占父节点宽度40%，则自适应宽度
        if ((child.width + margin.right) / dom.width > .4) {
            child.contrains["LayoutFlex"] = Contrain.LayoutFlex.Auto;
        } else {
            child.contrains["LayoutFlex"] = Contrain.LayoutFlex.None;
        }
        // 若左侧+自宽度占父节点宽度40%，则右对齐
        // if (margin.left - margin.right > config.dsl.horizontalSpacing) {
        if ((child.width + margin.left) / dom.width > .4) {
            child.contrains["LayoutSelfHorizontal"] = Contrain.LayoutSelfHorizontal.Right;
        }

    });
}