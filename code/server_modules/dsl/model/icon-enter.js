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
module.exports.template = function () {

}
module.exports.is = function (dom, parent, option, config) {
    const txt = dom.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    const img = dom.children.find((child) => {
        return child.type == Dom.type.IMAGE;
    });
    return img.abY < txt.abY &&
        Dom.isVertical(dom.children) &&
        Math.abs(txt.abX + txt.width / 2 - img.abX - img.width / 2) < config.dsl.operateErrorCoefficient &&
        img.height / txt.styles.maxSize < 6;
}
module.exports.adjust = function (dom, parent, option, config) {
    dom.contrains["LayoutPosition"] = Contrain.LayoutPosition.Vertical;
    dom.contrains["LayoutJustifyContentStart"] = Contrain.LayoutJustifyContent.center;
}