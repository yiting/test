let COMMON = require("../dsl_common.js");
let STORE = require("../dsl_store.js");

/**
 * Unordered List
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if (!dom.children) {
        return;
    }
    let max = 0,
        gid = {};
    dom.children.forEach(child => {
        if (child._groupId) {
            if (!gid[child._groupId]) {
                gid[child._groupId] = [];
            }
            gid[child._groupId].push(child._groupId);
            max = gid[child._groupId].length > max ? gid[child._groupId].length : max
        }
    });
    if (max > 1) {
        dom.layout = STORE.layout.UL
        return true;
    }
}