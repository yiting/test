const CONTRAIN = require('../dsl_contrain.js');
const STORE = require("../dsl_store.js");
const COMMON = require("../dsl_common.js");
/**
 * 文本按钮
 * 规则：内容只有一行文案且内容水平、垂直居中，且两边距大于1.5倍字号
 */
module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if (dom.children && dom.children.length == 1 &&
        dom.children[0].text &&
        dom.children[0].lines == 1) {
        // 获取最大字号
        let child = dom.children[0],
            maxSize = 0;
        child.styles.texts.forEach((t, i) => {
            maxSize = maxSize < t.size ? t.size : maxSize;
        });
        // Text和Parent中心点
        let vx = child.x + child.width / 2,
            vy = child.y + child.height / 2,
            px = dom.width / 2,
            py = dom.height / 2,
            padding = (dom.width - child.width) / 2;

        // 如果中心点偏移小于2
        if (dom.height / child.height < 3 &&
            Math.abs(vx - px) < 2 &&
            Math.abs(vy - py) < 2 &&
            maxSize * 1.5 < padding) {
            child.lineHeight = dom.height;
            child.textAlign = "center";
            dom.type = STORE.model.TEXT_BUTTON;
            COMMON.assign(dom, child);
            dom.children = [];
            return true;
        }
    }
}