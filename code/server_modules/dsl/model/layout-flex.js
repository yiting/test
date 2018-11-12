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
module.exports.mixCount = -5; //-1，即为任意混合数
module.exports.is = function (dom, parent, option, config) {
    return (dom.layout == Dom.layout.BLOCK ||
            dom.layout == Dom.layout.ROW) &&
        dom.children.length > 1 &&
        Dom.isHorizontal(dom.children) &&
        dom.children.some(child => {
            let margin = Dom.calMargin(child, dom, 'x');
            return child.type == Dom.type.TEXT && (margin.right - margin.left > child.styles.maxSize)
        })
}
module.exports.adjust = function (dom, parent, option, config) {
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Horizontal;
    dom.contrains["LayoutPoLayoutJustifyContentsition"] = Contrain.LayoutJustifyContent.Start;
    // 获取目标节点
    let targetText = dom.children.find((child, i) => {
        let margin = Dom.calMargin(child, dom, 'x');
        return child.type == Dom.type.TEXT && (margin.right - margin.left > child.styles.maxSize)
    });
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