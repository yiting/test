/**
 * numerical.js
 * 数值
 * 判断规则：两者都为文本，字号差异过大
 * 模板逻辑：小字号以绝对定位布局，调整文案大小
 */
const Contrain = require('../dsl_contrain.js');
const Dom = require("../dsl_dom.js");

const textCompareCoefficient = 1.4; //文本对比系数
module.exports.name = 'NUMERICAL';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 2;
module.exports.imageCount = 0;
module.exports.mixCount = 0; //-1，即为任意混合数
module.exports.canShareStyle = true; // 如果为简易元素，则不与其他结构复用样式
module.exports.isSimilar = function (a, b, config) {
    const aTxt = a.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    const bTxt = b.children.find((child) => {
        return child.type == Dom.type.TEXT;
    });
    return aTxt.styles.maxSize == bTxt.styles.maxSize;
}
module.exports.is = function (dom, parent, config) {
    if (!Dom.isHorizontal(dom.children)) {
        return false;
    }
    let sizes = dom.children.map(d => d.styles.maxSize),
        maxSize = Math.max(...sizes),
        minSize = Math.min(...sizes)
    // 如果最大字号比最小字号大于 文本对比系数 1.4倍，则模型成立
    return maxSize / minSize > textCompareCoefficient
}
module.exports.adjust = function (dom, parent, config) {
    // 查找最大节点
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

    // 将小字号放入大字号节点中
    maxObj.children.push(minObj);
    dom.children.splice(dom.children.indexOf(minObj), 1);
    // 调整最大子节点位置
    // 判断条件原因： 如果dom的type是block/row，则宽度须固定在两端
    if (dom.layout != Dom.layout.BLOCK && dom.layout != Dom.layout.ROW) {
        dom.width = maxObj.width;
        dom.x += maxObj.x;
        dom.abX += maxObj.x;
        maxObj.x = 0;
    }
    minObj.x -= maxObj.x;
    minObj.abX -= maxObj.x;
    minObj.y -= maxObj.y;
    minObj.abY -= maxObj.y;
    // 约束赋予
    maxObj.contrains["LayoutPosition"] = Contrain.LayoutPosition.Absolute;
    maxObj.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Default;
    minObj.contrains["LayoutSelfPosition"] = Contrain.LayoutSelfPosition.Absolute;
    if (minObj.abX < maxObj.abX) {
        minObj.contrains["LayoutSelfHorizontal"] = Contrain.LayoutSelfHorizontal.Left;
    } else {
        minObj.contrains["LayoutSelfHorizontal"] = Contrain.LayoutSelfHorizontal.Right;
    }
    if ((minObj.y + minObj.height / 2) < (maxObj.y + maxObj.height / 2)) {
        minObj.contrains["LayoutSelfVertical"] = Contrain.LayoutSelfVertical.Top;
    } else {
        minObj.contrains["LayoutSelfVertical"] = Contrain.LayoutSelfVertical.Bottom;
    }
}