let Contrain = require('../dsl_contrain.js');
let Store = require("../dsl_store.js");
let Common = require("../dsl_common.js");
/**
 * 聚合
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if (dom.layout == Store.layout.COLUMN) {
        let range = Common.calRange(dom.children);
        if (dom.height > range.height) {
            dom.contrains[Contrain.LayoutFixedHeight] = true;
        }
        return true;
    }
}