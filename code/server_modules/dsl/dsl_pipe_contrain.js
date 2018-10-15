const CONTRAIN = require('./dsl_contrain.js');
const Common = require('./dsl_common.js');
const Store = require('./dsl_store.js');

function horizontal(json) {
    let contrainsObj = {};
    // 水平排序
    let hJSON = Common.sort(json.children, function(dom) {
        return dom.x
    });
    // 统计水平关系
    let horizontalContrain = []
    hJSON.forEach((child, i) => {
        let prev = hJSON[i - 1],
            next = hJSON[i + 1]
        let margin_left = prev ? (child.x - prev.x - prev.width) : child.x,
            margin_right = next ? (next.x - child.x - child.width) : (json.width - child.x - child.width),
            margin_top = child.y,
            margin_bottom = json.height - child.y - child.height,
            offset_left = prev ? (child.x + child.width / 2 - prev.x - prev.width / 2) : (child.x + child.width / 2),
            offset_right = next ? (next.x + next.width / 2 - child.x - child.width / 2) : (json.width - child.x - child.width / 2),
            offset_top = child.y + child.height / 2,
            offset_bottom = json.height - offset_top
        horizontalContrain.push({
            margin_left,
            margin_right,
            margin_top,
            margin_bottom,
            offset_left,
            offset_right,
            offset_top,
            offset_bottom,
        });
    });
    // 遍历判断约束关系
    horizontalContrain.forEach((info, i) => {
        let prev = horizontalContrain[i - 1],
            next = horizontalContrain[i + 1]
        // direction
        contrainsObj[CONTRAIN.LayoutHorizontal] = contrainsObj[CONTRAIN.LayoutHorizontal] !== false && info.margin_left > -1;
        // justify
        contrainsObj[CONTRAIN.LayoutJustifyContentStart] = contrainsObj[CONTRAIN.LayoutJustifyContentStart] !== false && info.margin_left < Config.dsl.horizontalSpacing;
        contrainsObj[CONTRAIN.LayoutJustifyContentEnd] = contrainsObj[CONTRAIN.LayoutJustifyContentEnd] !== false && info.margin_right < Config.dsl.horizontalSpacing;
        // align
        contrainsObj[CONTRAIN.LayoutAlignItemsStart] = contrainsObj[CONTRAIN.LayoutAlignItemsStart] !== false && info.magrin_top < Option.positionDeviation;
        contrainsObj[CONTRAIN.LayoutAlignItemsEnd] = contrainsObj[CONTRAIN.LayoutAlignItemsEnd] !== false && info.margin_bottom < Option.positionDeviation;
        contrainsObj[CONTRAIN.LayoutAlignItemsCenter] = contrainsObj[CONTRAIN.LayoutAlignItemsCenter] !== false && Math.abs(info.offset_top - info.offset_bottom) < Option.positionDeviation;

        if (i == 0) {
            contrainsObj[CONTRAIN.LayoutJustifyContentBetween] = contrainsObj[CONTRAIN.LayoutJustifyContentBetween] !== false && info.margin_left == 0
        }
        if (i == horizontalContrain.length - 1) {
            contrainsObj[CONTRAIN.LayoutJustifyContentBetween] = contrainsObj[CONTRAIN.LayoutJustifyContentBetween] !== false && info.margin_right == 0
        }
        if (i > 0 && i < horizontalContrain.length - 1) {
            // 等宽布局
            contrainsObj[CONTRAIN.LayoutJustifyContentBetween] = contrainsObj[CONTRAIN.LayoutJustifyContentBetween] !== false && Math.abs(info.margin_left - info.margin_right < Option.positionDeviation)
        }
    });
    if (horizontalContrain.length) {
        contrainsObj[CONTRAIN.LayoutJustifyContentCenter] = horizontalContrain[0].margin_left == horizontalContrain[horizontalContrain.length - 1].margin_right
    }

    return contrainsObj[CONTRAIN.LayoutHorizontal] && contrainsObj;
}

/**
 * 元素垂直约束关系
 */
function vertical(json) {
    let contrainsObj = {};
    // 垂直排序
    let vJSON = Common.sort(json.children, function(dom) {
        return dom.y
    });
    // 统计垂直关系
    let verticalContrain = []
    vJSON.forEach((child, i) => {
        let prev = vJSON[i - 1],
            next = vJSON[i + 1]
        let magrin_top = prev ? (child.y - prev.y - prev.height) : child.y,
            margin_bottom = next ? (next.y - child.y - child.height) : (json.height - child.y - child.height),
            margin_left = child.x,
            margin_right = json.width - child.x - child.width,
            offset_top = prev ? (child.y + child.height / 2 - prev.y - prev.height / 2) : (child.y + child.height / 2),
            offset_bottom = next ? (next.y + next.height / 2 - child.y - child.height / 2) : (json.height - child.y - child.height / 2),
            offset_left = child.x + child.width / 2,
            offset_right = json.width - offset_left
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
        });
    });

    verticalContrain.forEach((info, i) => {
        let prev = verticalContrain[i - 1],
            next = verticalContrain[i + 1]
        // direction
        contrainsObj[CONTRAIN.LayoutVertical] = contrainsObj[CONTRAIN.LayoutVertical] !== false && info.magrin_top > -1
        // justify
        contrainsObj[CONTRAIN.LayoutJustifyContentStart] = contrainsObj[CONTRAIN.LayoutJustifyContentStart] !== false && info.magrin_top < Config.dsl.verticalSpacing;
        contrainsObj[CONTRAIN.LayoutJustifyContentEnd] = contrainsObj[CONTRAIN.LayoutJustifyContentEnd] !== false && info.margin_bottom < Config.dsl.verticalSpacing;
        // align
        contrainsObj[CONTRAIN.LayoutAlignItemsStart] = contrainsObj[CONTRAIN.LayoutAlignItemsStart] !== false && info.margin_left < Option.positionDeviation;
        contrainsObj[CONTRAIN.LayoutAlignItemsEnd] = contrainsObj[CONTRAIN.LayoutAlignItemsEnd] !== false && info.margin_right < Option.positionDeviation;
        contrainsObj[CONTRAIN.LayoutAlignItemsCenter] = contrainsObj[CONTRAIN.LayoutAlignItemsCenter] !== false && Math.abs(info.margin_left - info.margin_right) < Option.positionDeviation;

        if (i == 0) {
            contrainsObj[CONTRAIN.LayoutJustifyContentBetween] = contrainsObj[CONTRAIN.LayoutJustifyContentBetween] !== false && info.magrin_top == 0;
        }
        if (i == verticalContrain.length - 1) {
            contrainsObj[CONTRAIN.LayoutJustifyContentBetween] = contrainsObj[CONTRAIN.LayoutJustifyContentBetween] !== false && info.margin_bottom == 0;
        }
        if (i > 0 && i < verticalContrain.length - 1) {
            contrainsObj[CONTRAIN.LayoutJustifyContentBetween] = contrainsObj[CONTRAIN.LayoutJustifyContentBetween] !== false && Math.abs(info.magrin_top - info.margin_bottom < Option.positionDeviation)
        }
    });
    return contrainsObj[CONTRAIN.LayoutVertical] && contrainsObj;
}



// 计算父节点约束
function calChildrenContrain(json) {
    let children = json.children,
        firstChild = children[0],
        lastChild = children[children.length - 1]
    // 遍历子节点
    children.forEach(function(child, i) {
        calChildrenContrain(child);
    });
    // 如果无子节点，不计算节点约束
    if (!firstChild) {
        return;
    }
    // if (Object.values(Store.model).includes(json.type)) {
    // return;
    // }
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
    let rels = horizontal(json) || vertical(json);

    // 其他约束关系
    if (rels) {
        contrainsObj = rels;
    } else {
        contrainsObj[CONTRAIN.LayoutAbsolute] = true;
    }
    /**
     * 合并约束关系
     */
    if (Object.keys(contrainsObj).length) {
        // json.contrains = Object.assign({}, json.contrains, contrainsObj);
        json.contrains = Object.assign({}, contrainsObj, json.contrains);
    }
}

let Option = {},
    Config = {}
module.exports = function(data, conf, opt) {
    Option = {
        deviationCoefficient: .05, // 偏差系数
        positionDeviation: 2, // 位置误差
    }
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    calChildrenContrain(data);
}