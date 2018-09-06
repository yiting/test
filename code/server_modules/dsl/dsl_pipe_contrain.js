let CONTRAIN = require('./dsl_contrain.js');
/**
 * functionName
 * @param  {Object} option 主流程传进来的参数
 * @return {Optimize}        返回原对象
 */
// 计算父节点约束
function calChildrenContrain(json) {
    let children = json.children,
        firstChild = children[0],
        lastChild = children[children.length - 1]
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
        _right = _width,
        _bottom = _height
    let isHorizontal = true,
        isHorizontalTop = true,
        isHorizontalCenter = true,
        isHorizontalBottom = true,
        isVertical = true,
        isVerticalLeft = true,
        isVerticalRight = true,
        isVerticalCenter = true
    let maxHorizontalSpacing = 0,
        maxVerticalSpacing = 0;


    let leftSpacing = Number.MAX_VALUE,
        rightSpacing = Number.MAX_VALUE,
        topSpacing = Number.MAX_VALUE,
        bottomSpacing = Number.MAX_VALUE;
    children.forEach((child, i) => {
        let prev = children[i - 1];
        leftSpacing = leftSpacing > child.x ? child.x : leftSpacing
        rightSpacing = rightSpacing > (json.width - child.x - child.width) ? (json.width - child.x - child.width) : rightSpacing
        topSpacing = topSpacing > child.y ? child.y : topSpacing
        bottomSpacing = bottomSpacing > (json.height - child.y - child.height) ? (json.height - child.y - child.height) : bottomSpacing


        // 水平顶对齐
        isHorizontalTop = isHorizontalTop && (child.y < Option.positionDeviation);
        // 水平中心对齐
        isHorizontalCenter = isHorizontalCenter && (Math.abs(child.y + child.height / 2 - _centerY) < Option.positionDeviation);
        // 水平底对齐
        isHorizontalBottom = isHorizontalBottom && Math.abs((child.y + child.height) - _bottom) < Option.positionDeviation;
        // 垂直左对齐
        isVerticalLeft = isVerticalLeft && (child.x < Option.positionDeviation);
        // 垂直居中对齐
        isVerticalCenter = isVerticalCenter && Math.abs(child.x + child.width / 2 - _centerX) < Option.positionDeviation;
        // 垂直右对齐
        isVerticalRight = isVerticalRight && Math.abs(child.x + child.width - _right) < Option.positionDeviation;

        if (prev) {
            // 水平的
            isHorizontal = isHorizontal && ((prev.y < child.y + child.height) && (child.y < prev.y + prev.height));
            // 垂直的
            isVertical = isVertical && ((prev.x < child.x + child.width) && (child.x < prev.x + prev.width));
            // 水平最大间距
            maxHorizontalSpacing = maxHorizontalSpacing < Math.abs(child.x - prev.x - prev.width) ? Math.abs(child.x - prev.x - prev.width) : maxHorizontalSpacing
            // 垂直最大间距
            maxVerticalSpacing = maxVerticalSpacing < Math.abs(child.x - prev.x - prev.width) ? Math.abs(child.x - prev.x - prev.width) : maxVerticalSpacing
        }
    });

    let cObj = {};
    if (isHorizontal) {
        // 水平
        cObj[CONTRAIN.LayoutHorizontal] = true;
        if (Math.abs(leftSpacing - rightSpacing) < Option.positionDeviation && maxHorizontalSpacing >= leftSpacing) {
            // 两端对齐
            cObj[CONTRAIN.LayoutJustifyContentBetween] = true;
        } else if (Math.abs(leftSpacing - rightSpacing) < Option.positionDeviation && maxHorizontalSpacing < leftSpacing) {
            // 居中
            cObj[CONTRAIN.LayoutJustifyContentCenter] = true;
        } else if (leftSpacing < rightSpacing) {
            // 居左
            cObj[CONTRAIN.LayoutJustifyContentStart] = true;
        } else {
            // 居右
            cObj[CONTRAIN.LayoutJustifyContentEnd] = true;
        }
        if (isHorizontalCenter) {
            cObj[CONTRAIN.LayoutAlignItemsCenter] = true;
        } else if (isHorizontalBottom) {
            cObj[CONTRAIN.LayoutAlignItemsEnd] = true;
        } else {
            // isHorizontalTop
            cObj[CONTRAIN.LayoutAlignItemsStart] = true;
        }
    } else if (isVertical) {
        // 垂直
        cObj[CONTRAIN.LayoutVertical] = true;
        if (topSpacing == bottomSpacing && maxVerticalSpacing >= topSpacing) {
            // 两端对齐
            cObj[CONTRAIN.LayoutJustifyContentBetween] = true;
        } else if (topSpacing == bottomSpacing && maxVerticalSpacing < topSpacing) {
            // 居中
            cObj[CONTRAIN.LayoutJustifyContentCenter] = true;
        } else if (topSpacing < bottomSpacing) {
            // 居左
            cObj[CONTRAIN.LayoutJustifyContentStart] = true;
        } else {
            // 居右
            cObj[CONTRAIN.LayoutJustifyContentEnd] = true;
        }
        if (isVerticalCenter) {
            cObj[CONTRAIN.LayoutAlignItemsCenter] = true;
        } else if (isVerticalRight) {
            cObj[CONTRAIN.LayoutAlignItemsEnd] = true;
        } else {
            // isVerticalLeft
            cObj[CONTRAIN.LayoutAlignItemsStart] = true;
        }
    } else {
        cObj[CONTRAIN.LayoutAlignItemsAbsolute] = true;
    }
    json.contrains = cObj;

    // 遍历
    children.forEach(function(child, i) {
        calChildrenContrain(child);
    });
}
let Option = {},
    Config = {}
module.exports = function(data, conf, opt) {
    Option = {
        positionDeviation: 2, // 位置误差
    }
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    calChildrenContrain(data);
}