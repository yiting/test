let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");
/**
 * 图标标签
 * 规则：左右结构，左图标，右文本，文本单行
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    // 判断：只有两个节点
    if (dom.type == 'Qbody') {
        dom.type = STORE.model.BODY;
        dom.contrains[CONTRAIN.LayoutFixedWidth] = true;
        return true;
    }
}