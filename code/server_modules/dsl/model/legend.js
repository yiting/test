let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 图标标签Legend
 * 规则：左右结构，左图标，右文本，文本单行
 */
module.exports.name = 'LEGEND';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 1;
module.exports.imageCount = 1;
module.exports.mixCount = 0;//-1，即为任意混合数
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
    //  左右结构，节点图片高度与文案高度差小于一个字体
    return txt && img &&
        txt.lines == 1 &&
        Math.abs(img.height - txt.height) < txt.styles.minSize &&
        (img.abX + img.width < txt.abX)
}
module.exports.adjust = function () {

}