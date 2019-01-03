let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 分割线
 * 规则：无图片、无子节点的纯图案
 */
const segmentingProportion = 25;


module.exports.name = 'SEGMENTING';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -1; //-1，即为任意混合数
module.exports.canShareStyle = true; // 如果为简易元素，则不与其他结构复用样式
module.exports.isSimilar = function (a, b, config) {
    return a.width == b.width && a.height == b.height && (
        a.styles.background == b.styles.background &&
        a.styles.border == b.styles.border
    );
}
module.exports.is = function (dom, parent, config) {
    if (dom.children.length == 0) {
        return dom.model == module.exports || isSegmenting(dom, config)
    } else if (dom.children.length == 1) {
        return isSegmenting(dom.children[0], config);
    }
}
module.exports.adjust = function (dom, parent, config) {
    if (dom.children.length > 0) {
        let child = dom.children[0];
        Dom.replaceWith(dom, parent, child);
        child.x = child.abX - parent.abX;
        child.y = child.abY - parent.abY;
        dom = child;
    }
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
}


function isSegmenting(child, config) {
    const horizontalLength = config.device.width * config.dsl.segmentingCoefficient;
    return (!child.text && child.children.length == 0) && // 无文本，无子节点
        ((child.width / child.height >= segmentingProportion && // 水平分割线
            child.width >= horizontalLength &&
            child.height <= config.dsl.verticalSpacing
        ))
    // || (child.width / child.height >= segmentingProportion && // 垂直分割线
    // child.height >= verticalLength &&
    // child.width <= config.dsl.segmentingVerticalWidth))
}