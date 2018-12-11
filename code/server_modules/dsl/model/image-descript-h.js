let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 图文描述
 * 规则：
 * 1.上图下文案布局
 * 2.垂直的
 * 3.水平居中或左对齐
 */
module.exports.name = 'IMAGE-DESCRIPT-H';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 1;
module.exports.imageCount = 1;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.canShareStyle = true;
module.exports.isSimilar = function (a, b, config) {
    return a.children.length == b.children.length &&
        a.children.every((d1, i) => {
            return d1.similarMarkId == b.children[i].similarMarkId;
        });
}
module.exports.is = function (dom, parent, config) {
    const txt = dom.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    const img = dom.children.find((child) => {
        return child.type == Dom.type.IMAGE;
    });
    return img.length == 1 && img[0].abX < Math.min(txt.abX) &&
        Dom.isHorizontal(dom.children);
}
module.exports.adjust = function (dom, parent, config) {
    const txt = dom.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    txt.contrains["LayoutFlex"] = Contrain.LayoutFlex.Auto;
    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Horizontal;
    dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Start;
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Default;
    dom.contrains["LayoutFlex"] = Contrain.LayoutFlex.Auto;
}