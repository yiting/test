const Contrain = require('../dsl_contrain.js');
const Dom = require("../dsl_dom.js");
/**
 * 文本标签
 * 规则：内容只有一行文案且内容水平、垂直居中
 */
module.exports.name = 'TAG';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 1;
module.exports.imageCount = 0;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.canShareStyle = true; // 如果为简易元素，则不与其他结构复用样式
module.exports.isSimilar = function (a, b, config) {
    return Math.abs(a.styles.padding - b.styles.padding) < config.dsl.operateErrorCoefficient &&
        Math.abs(a.height - b.height) < config.dsl.operateErrorCoefficient &&
        a.styles.maxSize == b.styles.maxSize
}
module.exports.is = function (dom, parent, config) {
    const child = dom.children[0]
    const margin = Dom.calMargin(child, dom);
    // 如果中心点偏移小于2
    return child.lines == 1 &&
        (dom.path || dom.styles.background || dom.styles.border) &&
        dom.height / child.styles.maxSize < 3.5 &&
        Math.abs(margin.left - margin.right) < config.dsl.operateErrorCoefficient &&
        Math.abs(margin.top - margin.bottom) < config.dsl.operateErrorCoefficient &&
        child.styles.maxSize * 1.5 > margin.left // 边距小于1.5个字号
}
module.exports.adjust = function (dom, parent, config) {
    let child = dom.children[0];
    let margin = Dom.calMargin(child, dom);
    Dom.assign(dom, child);
    // dom reset
    dom.styles.lineHeight = dom.height;
    dom.styles.padding = margin.left;
    // dom.styles.textAlign = StyleDom.align["center"];
    dom.children = [];
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
}