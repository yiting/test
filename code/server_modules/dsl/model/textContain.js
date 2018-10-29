let Common = require("../dsl_common.js");
let Dom = require("../dsl_dom.js");

/**
 * 文案层叠模型
 * 规则：一个文案嵌套在另一个文案里
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if (dom.text && dom.children && dom.children.length > 0) {
        let child = new Dom({
            type: Store.model.TEXT,
            x: dom.x,
            y: dom.y,
            width: dom.width,
            height: dom.height,
            abX: dom.abX,
            abY: dom.abY,
            children: [dom].concat(dom.children)
        });
        dom.children = [];
        dom.x = 0;
        dom.y = 0;
        parent.children.some((item, i) => {
            if (item == dom) {
                parent.children[i] = child;
                return true;
            }
        });
        return true;
    }
}