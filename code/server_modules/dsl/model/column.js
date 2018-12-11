let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
/**
 * 聚合
 */
module.exports.name = 'COLUMN';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -30; //-1，即为任意混合数
module.exports.isSimilar = function (a,b,config) {
    return a.children.length == b.children.length &&
        a.children.every((d1, i) => {
            return d1.similarMarkId == b.children[i].similarMarkId;
        });
}
module.exports.canShareStyle = true;
module.exports.is = function (dom, parent, config) {
    return dom.layout == Dom.layout.COLUMN;
}
module.exports.adjust = function (dom, parent, config) {
    let range = Dom.calRange(dom.children);
    if (dom.height > range.height) {
        dom.contrains["LayoutFixedHeight"] = Contrain.LayoutFixedHeight.Fixed;
    }
    return true;
}