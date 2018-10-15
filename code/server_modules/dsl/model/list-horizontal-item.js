const CONTRAIN = require('../dsl_contrain.js');
const STORE = require("../dsl_store.js");
const Common = require("../dsl_common.js");
/**
 * list-horizontal-item
 * 列表水平内容
 * 规则：盒模型，水平方向内容
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    // 通过block或row选取横向布局内容
    if (dom._groupId &&
        dom.children &&
        dom.children.length > 2 &&
        (dom.layout == STORE.layout.BLOCK || dom.layout == STORE.layout.ROW) &&
        Common.isHorizontal(dom.children)
    ) {
        dom.contrains[CONTRAIN.LayoutHorizontal] = true;
        // 修正子节点
        dom.children.forEach((child, i) => {
            let prev = dom.children[i - 1],
                next = dom.children[i + 1],
                margin = Common.calMargin(child, dom, prev, next, 'x');
            // if (child.type != STORE.model.TEXT && child.layout != STORE.layout.INLINE) {
            // if (child.type != STORE.model.TEXT && child.layout != STORE.layout.INLINE) {
            // return
            // }
            // 暂定右边比左边宽20px时，为flex布局
            if (margin.right - margin.left > 20) {
                child.contrains[CONTRAIN.LayoutFlexGrow] = true;
                // child.contrains[CONTRAIN.LayoutHorizontal] = true;
                // child.contrains[CONTRAIN.LayoutJustifyContentStart] = true;
            }
            // 暂定左边比右边宽时，为固定布局
            if (margin.left - margin.right > 20) {
                child.contrains[CONTRAIN.LayoutSelfLeft] = false;
                child.contrains[CONTRAIN.LayoutSelfRight] = true;
                child.contrains[CONTRAIN.LayoutFlexShrink] = true;
                // child.contrains[CONTRAIN.LayoutFixedWidth] = true;
            }
            if (
                child.type == STORE.model.TEXT &&
                Math.abs(margin.left - margin.right) < config.dsl.operateErrorCoefficient
            ) {
                child.contrains[CONTRAIN.LayoutFixedWidth] = true;
                let w = Math.min(margin.left, margin.right)
                w -= w % config.dsl.dpr;
                child.width += w;
                child.x -= w / 2;
                child.abX -= w / 2;
            }
        });
        dom.type = STORE.model.LISTHORIZONTALITEM;
        return true;
    }
}