const CONTRAIN = require('../dsl_contrain.js');
const STORE = require("../dsl_store.js");
/**
 * 文本
 * 规则：单行纯文本
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if (!Object.values(STORE.layout).includes(dom.type) && dom.text && !dom.path && dom.lines == 1) {
        dom.type = STORE.model.TEXT;
        dom.contrains[CONTRAIN.LayoutAutoWidth] = true;
        dom.contrains[CONTRAIN.LayoutAutoHeight] = true;
        return true;
    }
}