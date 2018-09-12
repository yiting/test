let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");
/**
 * 聚合
 */
module.exports.template = function() {

}
module.exports.is = function(dom,parent,option,config) {
    if (dom.type == STORE.layout.BLOCK||dom.type==STORE.layout.ROW) {
        let paddingLeft = dom.x;
        let d = dom.x
        dom.x = 0;
        dom.abX -= d;
        dom.width = parent.width;
        dom.children.forEach((child, i) => {
            child.x += paddingLeft;
            child.abX += paddingLeft;
        });
        return true;
    }
}