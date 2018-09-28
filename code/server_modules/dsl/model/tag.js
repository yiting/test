const CONTRAIN = require('../dsl_contrain.js');
const STORE = require("../dsl_store.js");
const COMMON = require("../dsl_common.js");
/**
 * 文本标签
 * 规则：内容只有一行文案且内容水平、垂直居中
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if (dom.children && dom.children.length == 1 &&
        dom.children[0].text &&
        dom.children[0].lines == 1) {
        // Text和Parent中心点
        let child = dom.children[0],
            maxSize = 0;
        child.styles.texts.forEach((t, i) => {
            maxSize = maxSize < t.size ? t.size : maxSize;
        });
        let vx = child.x + child.width / 2,
            vy = child.y + child.height / 2,
            px = dom.width / 2,
            py = dom.height / 2,
            padding = (dom.width - child.width) / 2

        // 如果中心点偏移小于2
        if (dom.height / child.height < 3 &&
            Math.abs(vx - px) < 2 &&
            Math.abs(vy - py) < 2 &&
            maxSize * 1.5 > padding) {
            if (!dom.padding) {
                dom.padding = {};
            }
            COMMON.assign(dom, child);
            // dom reset
            dom.type = STORE.model.TAG;
            dom.padding["left"] = dom.padding["right"] = padding;
            dom.lineHeight = dom.height;
            dom.textAlign = "center";
            dom.children = [];
            // dom.styleAuto["width"] = true;
            // dom.contrains[CONTRAIN.LayoutAutoWidth] = true;
            return true;
        }
    }
}