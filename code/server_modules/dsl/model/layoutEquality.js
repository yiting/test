let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");

const deviationCoefficient = 0.05;

function cal(dom, width, Config) {
    // 等宽约束1
    width = width - width % Config.dsl.dpr;
    dom.contrains[CONTRAIN.LayoutHorizontal] = true;
    dom.contrains[CONTRAIN.LayoutJustifyContentCenter] = true;
    dom.children.forEach((child, i) => {
        let w = child.width,
            d = Math.abs(child.width - width) / 2
        d = d - d % Config.dsl.dpr;
        child.width = width;
        child.x -= d;
        child.abX -= d;
        child.contrains = {}
        child.contrains[CONTRAIN.LayoutHorizontal] = true;
        child.contrains[CONTRAIN.LayoutJustifyContentCenter] = true;
        if (child.children) {
            child.children.forEach((c) => {
                c.x += d;
                c.abX += d;
            });
        }
        delete child.styleAuto["width"];
    });
}


module.exports.is = function(dom, parent, option, config) {
    let children = dom.children;
    if (children.length > 2) {
        let isEqualWidth;
        let equalWidthCount = 0;
        children.forEach((child, i) => {
            let prev = children[i - 1],
                next = children[i + 1]
            let offset_left = prev ? (child.x + child.width / 2 - prev.x - prev.width / 2) : (child.x + child.width / 2),
                offset_right = next ? (next.x + next.width / 2 - child.x - child.width / 2) : (dom.width - child.x - child.width / 2)
            if (prev && next) {
                isEqualWidth = isEqualWidth !== false && Math.abs(offset_left - offset_right) / offset_left < deviationCoefficient
                equalWidthCount = offset_left + offset_right;
            }
        });
        if (isEqualWidth) {
            // 子节点宽度
            let equalWidthValue = equalWidthCount / (children.length - 2) / 2;
            cal(dom, equalWidthValue, config);
            dom.type = STORE.model.LAYOUT_EQUALITY;
            return true;
        }
    }
}