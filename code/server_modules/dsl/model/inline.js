let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");

/**
 * 行内结构
 * 规则：
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if (dom.layout === STORE.layout.INLINE) {
        dom.contrains[CONTRAIN.LayoutHorizontal] = true;
        dom.contrains[CONTRAIN.LayoutJustifyContentStart] = true;
        dom.contrains[CONTRAIN.LayoutJustifyContentEnd] = false;
        dom.contrains[CONTRAIN.LayoutJustifyContentCenter] = false;
        dom.contrains[CONTRAIN.LayoutJustifyContentBetween] = false;
        return true;
    }
}