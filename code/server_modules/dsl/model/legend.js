let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");
/**
 * 图标标签
 * 规则：左右结构，左图标，右文本，文本单行
 */
module.exports.template = function() {

}
module.exports.is = function(dom,parent,option,config) {
    // 判断：只有两个节点
    if (dom.children && dom.children.length == 2) {
        const txt = dom.children.find((child) => {
            return child.type == STORE.model.TEXT;
        });
        const img = dom.children.find((child) => {
            return child.type == STORE.model.IMAGE;
        });
        //  左右结构，节点图片高度与文案高度差小于一个字体
        if (txt && img &&
            txt.lines == 1 &&
            Math.abs(img.height - txt.height) < txt.minSize &&
            (img.abX + img.width < txt.abX)
        ) {
            dom.type = STORE.type.LEGEND;
            return true;
        }
    }
}