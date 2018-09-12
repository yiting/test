let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");

/**
 * 行内结构
 * 规则：
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if (dom.type === STORE.layout.INLINE) {
        // dom.contrains[CONTRAIN.LayoutAutoWidth] = true;
    }
}