/**
 * 等宽模型
 * 规则：子节点中心间距相等
 */
let Contrain = require('../dsl_contrain.js');
let Store = require("../dsl_store.js");
let Common = require("../dsl_common.js");

const deviationCoefficient = 0.05;

function cal(dom, width, config) {
    // 等宽约束1
    width = width - width % config.dsl.dpr;
    dom.contrains[Contrain.LayoutHorizontal] = true;
    dom.contrains[Contrain.LayoutJustifyContentCenter] = true;
    dom.children = dom.children.map((child, i) => {

        let w = child.width,
            d = Math.abs(child.width - width) / 2
        d = d - d % config.dsl.dpr;
        let newDom = Common.createDom({
            type: "layout",
            layout: Store.layout.COLUMN,
            x: child.x - d,
            y: child.y,
            abX: child.abX - d,
            abY: child.abY,
            width: width,
            height: child.height,
            children: [child]
        });
        child.x = d;
        newDom.contrains[Contrain.LayoutHorizontal] = true
        newDom.contrains[Contrain.LayoutJustifyContentCenter] = true;
        newDom.contrains[Contrain.LayoutFixedWidth] = true;
        return newDom;
    });
}


module.exports.is = function(dom, parent, option, config) {
    let children = dom.children;
    if (children.length > 2) {
        let isEqualWidth;
        let equalWidthCount = 0,
            firstPaddingLeft, lastPaddingRight

        children.forEach((child, i) => {
            let prev = children[i - 1],
                next = children[i + 1]
            if (prev && next) {
                let offset_left = prev ? (child.abX + child.width / 2 - prev.abX - prev.width / 2) : (child.abX + child.width / 2),
                    offset_right = next ? (next.abX + next.width / 2 - child.abX - child.width / 2) : (dom.width - child.abX - child.width / 2);
                let min_width = Math.min(prev.width, next.width)
                isEqualWidth = isEqualWidth !== false && Math.abs(offset_left - offset_right) / offset_left < deviationCoefficient
                equalWidthCount = offset_left + offset_right;
                if (!prev) {
                    firstPaddingLeft = offset_left
                }
                if (!next) {
                    lastPaddingRight = offset_right
                }
            }
        });
        if (isEqualWidth && Math.abs(firstPaddingLeft - lastPaddingRight) < 3) {
            // 子节点宽度
            let equalWidthValue = equalWidthCount / (children.length - 2) / 2;
            cal(dom, equalWidthValue, config);
            dom.type = Store.model.LAYOUT_EQUALITY;
            return true;
        }
    }
}