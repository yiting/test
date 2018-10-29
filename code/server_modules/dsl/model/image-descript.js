let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 图文描述
 * 规则：
 * 1.上图下文案布局
 * 2.垂直的
 * 3.水平居中或左对齐
 */
module.exports.name = 'IMAGE-DESCRIPT';
module.exports.type = Dom.type.IMAGE;
module.exports.textCount = 1;
module.exports.imageCount = 1;
module.exports.mixCount = -1; //-1，即为任意混合数
module.exports.template = function () {

}
module.exports.is = function (dom, parent, option, config) {
    const txt = dom.children.filter((child) => {
        return child.type == Dom.type.TEXT;
    });
    const img = dom.children.find((child) => {
        return child.type == Dom.type.IMAGE;
    });
    return img.abY < Math.min(...txt.map(t=>t.abY)) &&
        Dom.isVertical(dom.children);
}
module.exports.adjust = function (dom, parent, option, config) {
    dom.contrains["LayoutPosition"] = Contrain.LayoutPosition.Vertical;
    dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
}