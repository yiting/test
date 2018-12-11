let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 图标入口
 * 规则：
 * 1.上图标下文案布局
 * 2.垂直的
 * 3.水平居中的
 * 4.图片高度不大于文案最大字号的6倍
 */
module.exports.name = 'ICON-ENTER';
module.exports.type = Dom.type.IMAGE;
module.exports.textCount = 1;
module.exports.imageCount = 1;
module.exports.mixCount = 0; //-1，即为任意混合数

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
    // 中心距离相同
    return Math.abs((aTxt.abY + aTxt.height / 2 - aImg.abY - aImg.height / 2) - (bTxt.abY + bTxt.height / 2 - bImg.abY - bImg.height / 2)) < config.dsl.operateErrorCoefficient &&
        // 字号相同
        Math.abs(aTxt.styles.maxSize - bTxt.styles.maxSize) < config.dsl.operateErrorCoefficient;
}
module.exports.is = function (dom, parent, config) {
    return false;
    const txt = dom.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    const img = dom.children.find((child) => {
        return child.type == Dom.type.IMAGE;
    });
    return img.abY < txt.abY && // 垂直上图下文
        Dom.isVertical(dom.children) && // 垂直
        Math.abs(txt.abX + txt.width / 2 - img.abX - img.width / 2) < config.dsl.operateErrorCoefficient && //居中
        img.height / txt.styles.maxSize < 6;
}
module.exports.adjust = function (dom, parent, config) {
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Vertical;
    // dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Center;
    dom.contrains["LayoutAlignItems"] = Contrain.LayoutAlignItems.Center;
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;

    const txt = dom.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    txt.contrains["LayoutFlex"] = Contrain.LayoutFlex.Auto;
    txt.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Center;
}