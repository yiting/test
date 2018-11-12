const Contrain = require('../dsl_contrain.js');
const Dom = require("../dsl_dom.js");
/**
 * 文本按钮
 * 规则：内容只有一行文案且内容水平、垂直居中，且两边距大于1.5倍字号，有边框或背景或图片
 */
module.exports.name = 'ICON-BUTTON';
module.exports.type = Dom.type.IMAGE;
module.exports.textCount = 1;
module.exports.imageCount = 1;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.template = function () {

}
module.exports.is = function (dom, parent, option, config) {
    // 判断：只有两个节点
    const txt = dom.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    const img = dom.children.find((child) => {
        return child.type == Dom.type.IMAGE;
    });
    const txtMargin = Dom.calMargin(txt, dom),
        imgMargin = Dom.calMargin(img, dom);
    return txt && img &&
        txt.lines == 1 && // 单行
        (img.abX + img.width < txt.abX) && // 左右布局
        Math.abs(img.height - txt.height) < txt.styles.minSize &&
        (dom.path || dom.styles.background || dom.styles.border) && //有图案
        dom.height / txt.height < 3 &&
        Math.abs(imgMargin.left - txtMargin.right) < config.dsl.operateErrorCoefficient && // 水平居中
        Math.abs(imgMargin.top - imgMargin.bottom) < config.dsl.operateErrorCoefficient && // 垂直居中
        Math.abs(txtMargin.top - txtMargin.bottom) < config.dsl.operateErrorCoefficient // 垂直居中
}
module.exports.adjust = function (dom, parent, option, config) {
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed
    dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed
    dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Center;
}