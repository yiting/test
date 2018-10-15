let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");
/**
 * 图标入口
 * 规则：上图标下文案布局
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if (dom.children && dom.children.length > 0 && (dom.path||(dom.styles&&dom.styles.background))) {
        dom.contrains[CONTRAIN.LayoutFixedHeight] = true;
        dom.contrains[CONTRAIN.LayoutFixedWidth] = true;
        dom.type = STORE.model.BG;
    }
}