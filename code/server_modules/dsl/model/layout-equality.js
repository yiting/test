/**
 * layout-equality
 * 列表水平内容
 * 规则：
 *      水平布局
 *      子节点模型相同
 *      左右节点的中心点偏差相同
 *      中间节点与两边节点中心偏差相同
 */
let Contrain = require('../dsl_contrain.js');
let Dom = require("../dsl_dom.js");
let Model = require("../dsl_model.js");
let ColumnModel = require("./column.js");
module.exports.name = 'LAYOUT-EQUALITY';
module.exports.type = Dom.type.LAYOUT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = -5; //-1，即为任意混合数
module.exports.isSimilar = function (a, b, config) {
    // return false;
    return a.children.length == b.children.length &&
        a.children.every((d, i) => {
            return Math.abs(d.width - b.children[i].width) < config.dsl.operateErrorCoefficient &&
                Math.abs(d.height - b.children[i].width) < config.dsl.operateErrorCoefficient;
        })
};

module.exports.is = function (dom, parent, config) {
    if (dom.children.length < 2) {
        return false;
    }
    let children = dom.children,
        isHorizontal = Dom.isHorizontal(dom.children),
        isSameType = Dom.isSameType(children),
        lastIndex = children.length - 1,
        firstMargin = children[0].x,
        lastMargin = dom.width - children[lastIndex].x - children[lastIndex].width,
        firstOffsetLeft = children[0].x + children[0].width / 2,
        lastOffsetRight = dom.width - children[lastIndex].x - children[lastIndex].width / 2
    return isHorizontal &&
        isSameType &&
        Math.abs(firstOffsetLeft - lastOffsetRight) < config.dsl.operateErrorCoefficient &&
        firstMargin > 0 &&
        lastMargin > 0 &&
        children.every((child, i) => {
            const offset = Dom.calOffset(child, dom, 'x');
            return i == 0 || i == lastIndex ||
                Math.abs(offset.left - offset.right) < config.dsl.operateErrorCoefficient;
        })
}
module.exports.adjust = function (dom, parent, config) {

    let lastIndex = dom.children.length - 1,
        widths = [];
    dom.children.forEach((child, i) => {
        const offset = Dom.calOffset(child, dom, 'x')
        if (i == 0) {
            widths.push(offset.left * 2);
            widths.push(offset.right)
        } else if (i == lastIndex) {
            widths.push(offset.right * 2);
            widths.push(offset.left);
        } else {
            widths.push(offset.left);
            widths.push(offset.right);
        }
    });
    let equalWidth = Math.min(...widths)
    // 等差值
    equalWidth -= (equalWidth % config.dsl.dpr);

    dom.contrains["LayoutDirection"] = Contrain.LayoutDirection.Horizontal;
    dom.contrains["LayoutPosition"] = Contrain.LayoutPosition.Static;
    dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Center;
    dom.children.forEach(c => correctWidth(equalWidth, c, dom, config))
    dom.type = dom.children[0].type;
}

function correctWidth(width, dom, parent, config) {
    let dir = (width - dom.width) / 2;
    // 如果是固定宽度，则包裹多一层
    if (dom.contrains["LayoutFixedWidth"] == Contrain.LayoutFixedWidth.Fixed) {
        let newDom = new Dom({
            type: Dom.type.LAYOUT,
            layout: Dom.layout.COLUMN,
            x: dom.x - dir,
            y: dom.y,
            abX: dom.abX - dir,
            abY: dom.abY,
            width: width,
            height: dom.height,
            children: [dom]
        });
        dom.x = dir;
        dom.y = 0;
        newDom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
        Dom.replaceWith(dom, parent, newDom);
        Model.adjust(ColumnModel, newDom, parent, config);
        newDom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Center;
    } else {
        dom.contrains["LayoutFixedWidth"] = Contrain.LayoutFixedWidth.Fixed;
        dom.width = width;
        dom.x -= dir;
        dom.abX -= dir;
        dom.children.forEach(child => {
            child.abX += dir;
            child.x += dir;
        });
        dom.contrains["LayoutJustifyContent"] = Contrain.LayoutJustifyContent.Center;
    }
}