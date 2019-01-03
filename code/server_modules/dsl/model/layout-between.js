/**
 * layout-between
 * 水平内容
 * 规则：
 *      水平布局
 *      两边子节点模型两端对齐
 *      中间节点中心点偏差相同
 */
let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
module.exports.name = 'LAYOUT-BETWEEN';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -10; //-1，即为任意混合数
module.exports.canShareStyle = true;
module.exports.isSimilar = function (a, b, config) {
    // return false;
}
module.exports.is = function (dom, parent, config) {
    if (dom.children.length == 3) {
        let children = dom.children,
            isHorizontal = Dom.isHorizontal(dom.children),
            lastIndex = children.length - 1,
            firstMarginLeft = children[0].x,
            lastMarginRight = dom.width - children[2].x - children[2].width,
            centerOffsetLeft = children[1].x + children[1].width / 2,
            centerOffsetRight = dom.width - children[1].x - children[1].width / 2
        return isHorizontal &&
            children.some((child, i) => {
                const offset = Dom.calOffset(child, dom, 'x');
                const margin = Dom.calMargin(child, dom, 'x');
                return i != 0 && i != lastIndex &&
                    Math.abs(offset.left - offset.right) < config.dsl.operateErrorCoefficient &&
                    margin.left > config.dsl.horizontalSpacing &&
                    margin.right > config.dsl.horizontalSpacing;
            }) &&
            Math.abs(firstMarginLeft - lastMarginRight) < config.dsl.operateErrorCoefficient &&
            Math.abs(centerOffsetLeft - centerOffsetRight) < config.dsl.operateErrorCoefficient * 2
    }
}
module.exports.adjust = function (dom, parent, config) {
    let left = dom.children[0],
        center = dom.children[1],
        right = dom.children[2];
    dom.contrains["LayoutPosition"] = Contrain.LayoutPosition.Absolute;
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Horizontal;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
    dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Center;
    // left
    left.contrains["LayoutSelfPosition"] = Contrain.LayoutSelfPosition.Absolute;
    left.contrains["LayoutSelfHorizontal"] = Contrain.LayoutSelfHorizontal.Left;
    left.contrains["LayoutSelfVertical"] = Contrain.LayoutSelfVertical.Top;
    // right
    right.contrains["LayoutSelfPosition"] = Contrain.LayoutSelfPosition.Absolute;
    right.contrains["LayoutSelfHorizontal"] = Contrain.LayoutSelfHorizontal.Right;
    right.contrains["LayoutSelfVertical"] = Contrain.LayoutSelfVertical.Top;
    // center
    if (center.type == Dom.type.TEXT) {
        center.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Center;
    }


}