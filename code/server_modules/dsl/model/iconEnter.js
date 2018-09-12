let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");
/**
 * 图标入口
 * 规则：上图标下文案布局
 */
module.exports.template = function() {

}
module.exports.is = function(dom,parent,option,config) {
    if (dom.children && dom.children.length == 2) {
        const txt = dom.children.find((child) => {
            return child.type == STORE.model.TEXT;
        });
        const img = dom.children.find((child) => {
            return child.type == STORE.model.IMAGE;
        });
        if (txt && img && img.abY + img.height < txt.abY) {
            dom.type = STORE.model.ICONENTER;
        }
        return true;
    }
}