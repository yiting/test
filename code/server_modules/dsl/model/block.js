let Contrain = require('../dsl_contrain.js');
let Store = require("../dsl_store.js");
let Common = require("../dsl_common.js");
/**
 * 聚合
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if ((dom.layout == Store.layout.BLOCK || dom.layout == Store.layout.ROW)) {
        let range = Common.calRange(dom.children);
        if (dom.height > range.height) {
            dom.contrains[Contrain.LayoutFixedHeight] = true;
        }
        dom.contrains[Contrain.LayoutFixedWidth] = true;
        // let paddingLeft = dom.x;
        // let d = dom.x,
        //     dir = parent.width - d - dom.width;
        // dom.x = 0;
        // dom.abX -= d;
        // dom.width = parent.width;
        // dom.children.forEach((child, i) => {
        //     child.x += paddingLeft;
        // });
        if (dom.text) {
            if (Math.abs(dir - d) < config.dsl.operateErrorCoefficient) {
                dom.contrains[Contrain.LayoutAlignCenter] = true;
            } else if (d > dir) {
                dom.contrains[Contrain.LayoutAlignRight] = true;
            } else {
                dom.contrains[Contrain.LayoutAlignLeft] = true;
            }
        }
        return true;
    }
}