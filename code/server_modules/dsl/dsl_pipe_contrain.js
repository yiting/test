/**
 * 模块理念：
 * 1.从子节点起逐渐向跟节点遍历
 * 2.计算当前节点的子节点位置关系，得出当前节点的约束属性
 */

const CONTRAIN = require('./dsl_contrain.js');
const Common = require('./dsl_common.js');
const Dom = require('./dsl_dom.js');

function horizontal(json) {
    let contrainsObj = {};
    // 水平排序
    let hJSON = Common.sortByLogic(json.children, function (dom) {
        return dom.x
    });
    // 统计水平关系
    let horizontalContrain = []
    hJSON.forEach((child, i) => {
        const prev = hJSON[i - 1],
            next = hJSON[i + 1]
        const margin_left = prev ? (child.x - prev.x - prev.width) : child.x,
            margin_right = next ? (next.x - child.x - child.width) : (json.width - child.x - child.width),
            margin_top = child.y,
            margin_bottom = json.height - child.y - child.height,
            offset_left = prev ? (child.x + child.width / 2 - prev.x - prev.width / 2) : (child.x + child.width / 2),
            offset_right = next ? (next.x + next.width / 2 - child.x - child.width / 2) : (json.width - child.x - child.width / 2),
            offset_top = child.y + child.height / 2,
            offset_bottom = json.height - offset_top,
            center_offset = Math.abs(json.width / 2 - child.x - child.width / 2)


        horizontalContrain.push({
            margin_left,
            margin_right,
            margin_top,
            margin_bottom,
            offset_left,
            offset_right,
            offset_top,
            offset_bottom,
            center_offset,
        });
    });


    let firstContrain = horizontalContrain[0],
        lastContrain = horizontalContrain[horizontalContrain.length - 1],
        maxDomSpacing = 0,
        minMarginTop = Number.MAX_VALUE,
        minMarginBottom = Number.MAX_VALUE,
        lastIndex = horizontalContrain.length - 1;
    // 遍历判断约束关系
    horizontalContrain.forEach((info, i) => {
        // direction
        // contrainsObj["LayoutHorizontal"] = contrainsObj["LayoutHorizontal"] !== false && info.margin_left > -1;
        // justify start
        contrainsObj["LayoutJustifyContentStart"] = contrainsObj["LayoutJustifyContentStart"] !== false && info.margin_left < Config.dsl.horizontalSpacing;
        // justify end
        contrainsObj["LayoutJustifyContentEnd"] = contrainsObj["LayoutJustifyContentEnd"] !== false && info.margin_left > 0 && info.margin_right < Config.dsl.horizontalSpacing;
        contrainsObj["LayoutJustifyContentCenter"] = contrainsObj["LayoutJustifyContentCenter"] !== false &&
            ((lastIndex - i == i) ? (info.center_offset < Config.dsl.operateErrorCoefficient * 2) :
                (Math.abs(info.center_offset - horizontalContrain[lastIndex - i].center_offset) < Config.dsl.operateErrorCoefficient * 2));

        // align
        contrainsObj["LayoutAlignItemsStart"] = contrainsObj["LayoutAlignItemsStart"] !== false && info.margin_top < Config.dsl.operateErrorCoefficient;

        contrainsObj["LayoutAlignItemsEnd"] = contrainsObj["LayoutAlignItemsEnd"] !== false && info.margin_top > 0 && info.margin_bottom < Config.dsl.operateErrorCoefficient;

        contrainsObj["LayoutAlignItemsCenter"] = contrainsObj["LayoutAlignItemsCenter"] !== false && Math.abs(info.offset_top - info.offset_bottom) < Config.dsl.operateErrorCoefficient;
        // center 获取内容间距
        if (i != 0) {
            maxDomSpacing = maxDomSpacing > info.margin_left ? maxDomSpacing : info.margin_left;
        }
        // fixed height
        minMarginTop = minMarginTop < info.margin_top ? minMarginTop : info.margin_top;
        minMarginBottom = minMarginBottom < info.margin_bottom ? minMarginBottom : info.margin_bottom;
    });

    if (horizontalContrain.length) {
        /* LayoutJustifyContentCenter
            1. 两端差值在0～误差之间
            2. 元素间距小于两端间距
         */
        // 偏移系数为误操作值，误操作1px，两端差值则会乘以2
        contrainsObj["LayoutJustifyContentCenter"] = contrainsObj["LayoutJustifyContentCenter"] && Math.abs(firstContrain.margin_left - lastContrain.margin_right) < Config.dsl.operateErrorCoefficient * 2

        // 计算Fixed：如果最小间距大于操作误差，则固定高或宽
        contrainsObj["LayoutFixedHeight"] = json.path || json.styles.background || json.styles.border || minMarginTop > Config.dsl.operateErrorCoefficient || minMarginBottom > Config.dsl.operateErrorCoefficient;

        contrainsObj["LayoutFixedWidth"] = json.path || json.styles.background || json.styles.border || firstContrain.margin_left > Config.dsl.operateErrorCoefficient || lastContrain.margin_right > Config.dsl.operateErrorCoefficient;
    }
    contrainsObj["LayoutHorizontal"] = Dom.isHorizontal(json.children);
    return contrainsObj["LayoutHorizontal"] && contrainsObj
}
/* 
    计算文案定位
 */
function calYH(dom, parent) {
    return {
        x: dom.x,
        y: (dom.textAbY || dom.abY) - parent.abY,
        width: dom.width,
        height: dom.textHeight || dom.height
    }
}

/**
 * 元素垂直约束关系
 */
function vertical(json) {
    let contrainsObj = {};
    // 垂直排序
    let vJSON = Common.sortByLogic(json.children, function (dom) {
        return dom.textAb || dom.abY;
    });
    // 统计垂直关系

    let verticalContrain = []
    vJSON.forEach((dom, i) => {
        let prev = vJSON[i - 1] && calYH(vJSON[i - 1], json),
            next = vJSON[i + 1] && calYH(vJSON[i + 1], json),
            child = calYH(dom, json);
        let magrin_top = prev ? (child.y - prev.y - prev.height) : child.y,
            margin_bottom = next ? (next.y - child.y - child.height) : (json.height - child.y - child.height),
            margin_left = child.x,
            margin_right = json.width - child.x - child.width,
            offset_top = prev ? (child.y + child.height / 2 - prev.y - prev.height / 2) : (child.y + child.height / 2),
            offset_bottom = next ? (next.y + next.height / 2 - child.y - child.height / 2) : (json.height - child.y - child.height / 2),
            offset_left = child.x + child.width / 2,
            offset_right = json.width - offset_left,
            center_offset = Math.abs(json.width / 2 - child.x - child.width / 2)

        verticalContrain.push({
            // dom: child,
            magrin_top,
            margin_bottom,
            margin_left,
            margin_right,
            offset_top,
            offset_bottom,
            offset_left,
            offset_right,
            center_offset,
        });
    });

    let firstContrain = verticalContrain[0],
        lastContrain = verticalContrain[verticalContrain.length - 1],
        maxDomSpacing = 0,
        minMarginLeft = Number.MAX_VALUE,
        minMarginRight = Number.MAX_VALUE
    verticalContrain.forEach((info, i) => {
        // justify
        contrainsObj["LayoutJustifyContentStart"] = contrainsObj["LayoutJustifyContentStart"] !== false && info.magrin_top < Config.dsl.verticalSpacing;

        contrainsObj["LayoutJustifyContentEnd"] = contrainsObj["LayoutJustifyContentEnd"] !== false && info.margin_top > 0 && info.margin_bottom < Config.dsl.verticalSpacing;

        // contrainsObj["LayoutJustifyContentCenter"] = contrainsObj["LayoutJustifyContentCenter"] !== false && Math.abs(info.center_offset - horizontalContrain[lastIndex - i].center_offset) < Config.dsl.horizontalSpacing * 2;
        // align
        contrainsObj["LayoutAlignItemsStart"] = contrainsObj["LayoutAlignItemsStart"] !== false && info.margin_left < Config.dsl.operateErrorCoefficient;

        contrainsObj["LayoutAlignItemsEnd"] = contrainsObj["LayoutAlignItemsEnd"] !== false && info.margin_left > 0 && info.margin_right < Config.dsl.operateErrorCoefficient;

        contrainsObj["LayoutAlignItemsCenter"] = contrainsObj["LayoutAlignItemsCenter"] !== false && Math.abs(info.margin_left - info.margin_right) < Config.dsl.operateErrorCoefficient;
        // center 获取内容间距
        if (i != 0) {
            maxDomSpacing = maxDomSpacing > info.magrin_top ? maxDomSpacing : info.margin_bottom;
        }
        // fixed width
        minMarginLeft = minMarginLeft < info.margin_left ? minMarginLeft : info.margin_left;

        minMarginRight = minMarginRight < info.margin_right ? minMarginRight : info.margin_right;

    });
    if (verticalContrain.length) {
        // 计算JustifyContent： 偏移系数为误操作值，误操作1px，两端差值则会乘以2
        // contrainsObj["LayoutJustifyContentCenter"] =contrainsObj["LayoutJustifyContentCenter"]&& Math.abs(firstContrain.margin_top - lastContrain.margin_bottom) < Config.dsl.operateErrorCoefficient * 2 
        // 计算Fixed：如果最小间距大于操作误差，则固定高或宽
        contrainsObj["LayoutFixedWidth"] = json.path || json.styles.background || json.styles.border ||
            minMarginLeft > Config.dsl.operateErrorCoefficient || minMarginRight > Config.dsl.operateErrorCoefficient;
        contrainsObj["LayoutFixedHeight"] = json.path || json.styles.background || json.styles.border ||
            firstContrain.magrin_top > Config.dsl.operateErrorCoefficient || lastContrain.margin_bottom > Config.dsl.operateErrorCoefficient;
    }
    contrainsObj["LayoutVertical"] = Dom.isVertical(json.children);
    return contrainsObj["LayoutVertical"] && contrainsObj;
}

function absolute(json) {
    let contrainsObj = {};
    if (!json.contrains["LayoutPosition"] || json.contrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Absolute) {
        contrainsObj["LayoutAbsolute"] = true;
        contrainsObj["LayoutFixedWidth"] = true;
        contrainsObj["LayoutFixedHeight"] = true;
        json.children.forEach(child => {
            child.contrains["LayoutSelfPosition"] = CONTRAIN.LayoutSelfPosition.Absolute;
            child.contrains["LayoutSelfHorizontal"] = CONTRAIN.LayoutSelfHorizontal.Left;
            child.contrains["LayoutSelfVertical"] = CONTRAIN.LayoutSelfVertical.Top;
            child.contrains["LayoutFixedWidth"] = CONTRAIN.LayoutFixedWidth.Fixed;
            child.contrains["LayoutFixedHeight"] = CONTRAIN.LayoutFixedHeight.Fixed;
        });
    }

    return contrainsObj["LayoutAbsolute"] && contrainsObj;
}


// 计算父节点约束
function calChildrenContrain(json) {
    let children = json.children,
        firstChild = children[0],
        lastChild = children[children.length - 1]
    // 遍历子节点
    children.forEach(function (child, i) {
        calChildrenContrain(child);
    });
    // 如果无子节点，不计算节点约束
    if (!firstChild) {
        return;
    }
    let _x = json.x,
        _y = json.y,
        _width = json.width,
        _height = json.height,
        _centerX = _width / 2,
        _centerY = _height / 2,
        contrainsObj = {};
    /**
     * 元素水平约束关系
     */
    let rels = horizontal(json) ||
        vertical(json) ||
        absolute(json) || {};
    let relsObj = {
        LayoutDirection: (rels.LayoutHorizontal && CONTRAIN.LayoutDirection.Horizontal)||  
            (rels.LayoutVertical&&CONTRAIN.LayoutDirection.Vertical),
        LayoutPosition: (rels.LayoutAbsolute && CONTRAIN.LayoutPosition.Absolute) ||
            CONTRAIN.LayoutPosition.Static,
        LayoutJustifyContent: (rels.LayoutJustifyContentCenter && CONTRAIN.LayoutJustifyContent.Center) ||
            (rels.LayoutJustifyContentEnd && CONTRAIN.LayoutJustifyContent.End) ||
            (rels.LayoutJustifyContentStart && CONTRAIN.LayoutJustifyContent.Start) ||
            CONTRAIN.LayoutJustifyContent.Start,
        LayoutAlignItems: (rels.LayoutAlignItemsCenter && CONTRAIN.LayoutAlignItems.Center) ||
            (rels.LayoutAlignItemsStart && CONTRAIN.LayoutAlignItems.Start) ||
            (rels.LayoutAlignItemsEnd && CONTRAIN.LayoutAlignItems.End) ||
            CONTRAIN.LayoutAlignItems.Start,
        LayoutFixedWidth: (rels.LayoutFixedWidth && CONTRAIN.LayoutFixedWidth.Fixed) ||
            CONTRAIN.LayoutFixedWidth.Default,
        LayoutFixedHeight: (rels.LayoutFixedHeight && CONTRAIN.LayoutFixedHeight.Fixed) ||
            CONTRAIN.LayoutFixedHeight.Default

    };
    // 合并约束关系
    contrainsObj = Object.assign({}, relsObj, json.contrains);
    // 调整约束结果
    json.contrains = contrainsObj;
}

let Option = {},
    Config = {}
module.exports = function (data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    calChildrenContrain(data);
}