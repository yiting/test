let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");
/**
 * 段落
 * 规则：多行纯文本
 */
module.exports.template = function(dom) {
    let o = {};
    // o.contrains[CONTRAIN.LayoutAutoHeight] = true;
    o.tagStart = "p";
    o.tagEnd = "p";
    o.innerHTML = dom.text;
    return o;
}
module.exports.is = function(dom, parent, option, config) {
    if (dom.text && dom.lines > 1 && (!dom.children || dom.children.length == 0)) {
        dom.type = STORE.model.PARAGRAPH;
        return true;
    }
}