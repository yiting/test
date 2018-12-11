let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 图文描述
 * 规则：
 * 1.上图下文案布局
 * 2.垂直的
 * 3.水平居中或左对齐
 */
module.exports.name = 'IMAGE-DESCRIPT-V';
module.exports.type = Dom.type.IMAGE;
module.exports.textCount = 1;
module.exports.imageCount = 1;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.canShareStyle = true;
module.exports.isSimilar = function (a, b, config) {
    const aImg = a.children.find((child) => {
        return child.type == Dom.type.IMAGE;
    });
    const aTxt = a.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    const bImg = b.children.find((child) => {
        return child.type == Dom.type.IMAGE;
    });
    const bTxt = b.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    return Math.abs(aImg.width - bImg.width) < config.dsl.operateErrorCoefficient &&
        Math.abs(aTxt.styles.maxSize - bTxt.styles.maxSize) < config.dsl.operateErrorCoefficient;
}
module.exports.is = function (dom, parent, config) {
    const txt = dom.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    const img = dom.children.find((child) => {
        return child.type == Dom.type.IMAGE;
    });
    return img.abY < Math.min(txt.abY) &&
        Dom.isVertical(dom.children);
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Vertical;
    // dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
}