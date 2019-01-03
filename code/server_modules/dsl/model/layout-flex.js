const Contrain = require('../dsl_contrain.js');
const Dom = require("../dsl_dom.js");
/**
 * layout-list-item
 * 列表水平内容
 * 规则：盒模型，水平方向内容
 */
module.exports.name = 'LAYOUT-FLEX';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 1;
module.exports.imageCount = 0;
module.exports.mixCount = -10; //-1，即为任意混合数
module.exports.canShareStyle = true;
module.exports.isSimilar = function (a, b, config) {
    // a.children.length == b.children.length
    const aText = getText(a, config),
        bText = getText(b, config);
    return Math.abs(aText.x - bText.x) < config.dsl.operateErrorCoefficient;
};
module.exports.is = function (dom, parent, config) {
    return (dom.layout == Dom.layout.BLOCK ||
            dom.layout == Dom.layout.ROW) &&
        dom.children.length > 1 &&
        Dom.isHorizontal(dom.children) &&
        getText(dom, config)
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Horizontal;
    dom.contrains["LayoutPoLayoutJustifyContentsition"] = Contrain.LayoutJustifyContent.Start;
    // 获取目标节点
    let targetText = getText(dom, config);
    if (targetText) {
        // 设置目标节点约束
        targetText.contrains["LayoutFlex"] = Contrain.LayoutFlex.Auto;
        targetText.contrains["LayoutSelfHorizontal"] = Contrain.LayoutSelfHorizontal.Left;
        dom.children.forEach(child => {
            if (child == targetText) {
                return;
            }
            child.contrains["LayoutSelfHorizontal"] = child.abX < targetText.abX ? Contrain.LayoutSelfHorizontal.Left : Contrain.LayoutSelfHorizontal.Right;
        })
    }
}

function getText(dom, config) {
    return dom.children.find((child, i) => {
        if (i == dom.children.length - 1) {
            return false;
        }
        let margin = Dom.calMargin(child, dom, 'x');
        // 备注：不使用child.text，是因为存在没有文本的结构
        return child.type == Dom.type.TEXT &&
            child.contrains["LayoutFixedWidth"] != Contrain.LayoutFixedWidth.Fixed &&
            (margin.right - margin.left > config.dsl.horizontalSpacing)
    })
}