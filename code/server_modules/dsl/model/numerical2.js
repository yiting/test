/**
 * numerical.js
 * 数值
 * 判断规则：两者都为文本，字号差异过大
 * 模板逻辑：小字号以绝对定位布局，调整文案大小
 */
const Common = require("../dsl_common.js");
const Contrain = require('../dsl_contrain.js');
const Store = require("../dsl_store.js");

const textCompareCoefficient = 1.4; //文本对比系数
module.exports.template = function(dom) {

}
module.exports.is = function(dom, parent, option, config) {
    if (
        dom.children && dom.children.length == 2 &&
        dom.children.every(s => s.type == Store.model.TEXT) &&
        Common.isHorizontal(dom.children)
    ) {
        let maxSize = Number.NEGATIVE_INFINITY,
            minSize = Number.POSITIVE_INFINITY,
            maxObj,
            minObj;
        dom.children.forEach((s, i) => {
            if (s.styles.maxSize > maxSize) {
                maxSize = s.styles.maxSize;
                maxObj = s;
            }
            if (s.styles.maxSize < minSize) {
                minSize = s.styles.maxSize;
                minObj = s;
            }
        });
        // 如果最大字号比最小字号大于 文本对比系数 1.4倍，则模型成立
        if (maxSize / minSize > textCompareCoefficient) {
            dom.type = Store.model.NUMERICAL;
            // 创建包含最大节点的新节点
            let newDom = Common.createDom({
                type: "layout",
                layout: Store.layout.INLINE,
                x: maxObj.x,
                y: maxObj.y,
                abX: maxObj.abX,
                abY: maxObj.abY,
                width: maxObj.width,
                height: maxObj.height,
                children: dom.children
            });

            newDom.contrains[Contrain.LayoutAbsolute] = true;

            // 调整最大子节点位置
            dom.children = [newDom];
            if (dom.layout == Store.layout.INLINE) {
                dom.width = maxObj.width;
            }
            dom.x -= maxObj.x;
            minObj.x -= maxObj.x;
            minObj.y -= maxObj.y;
            maxObj.x = 0;
            maxObj.y = 0;
            minObj.contrains[Contrain.LayoutSelfAbsolute] = true;
            if (minObj.abX < maxObj.abX) {
                minObj.contrains[Contrain.LayoutSelfLeft] = true;
            } else {
                minObj.contrains[Contrain.LayoutSelfRight] = true;
            }
            if ((minObj.y + minObj.height / 2) < (maxObj.y + maxObj.height / 2)) {
                minObj.contrains[Contrain.LayoutSelfTop] = true;
            } else {
                minObj.contrains[Contrain.LayoutSelfBottom] = true;
            }
            return true;
        }
    }
}