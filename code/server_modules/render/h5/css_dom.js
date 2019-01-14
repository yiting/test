// 样式的计算处理
const Common = require('../../dsl2/dsl_common.js');
const Constraints = require('../../dsl2/dsl_constraints.js');
const Utils = require('../render_utils.js');

// 生成的Css记录树
let cssDomTree = null,
    similarData = null;

// 
let process = function (data, layoutType) {

    // 构建cssTree并返回
    cssDomTree = _buildTree(null, data, layoutType);
    return cssDomTree;
}

let getCssString = function (cssDomTree, similarData) {
    // 获取cssTree解析出的样式
    let cssStr = '';
    let css = []; // 每个CssDom节点返回的样式数组
    _parseTree(css, cssDomTree, similarData);
    css.forEach(function (value, key, arr) {
        cssStr += value + '\n';
    });
    return cssStr;
}

/**
 * 构建cssDom树
 * @param {Object} parent 
 * @param {Json} data 
 * @param {Int} layoutType 
 */
let _buildTree = function (parent, data, layoutType) {
    let cssNode = new CssDom(parent, data, layoutType);
    // 构建树
    if (!parent) {
        cssDomTree = cssNode;
    } else {
        parent.children.push(cssNode);
    }

    // if (data.children && data.children.length > 0) {
    data.children.forEach(data => {
        _buildTree(cssNode, data, layoutType);
    });
    // 对当前节点补充约束
    cssNode._supplementConstraints();
    // 对当前节点边界进行计算
    // cssNode._calculateBoundary(this);
    return cssNode;
}

/**
 * 解析获取css属性
 * @param {Array} arr 字符串收集数组
 * @param {CssDom} dom CssDom节点
 */
let _parseTree = function (arr, dom, similarData) {
    let str = dom.getCss(similarData);
    if (str) {
        arr.push(str);
    }

    dom.children.forEach(child => {
        _parseTree(arr, child, similarData);
    });
}

const CompatibleKey = ['box-flex', 'box-orient', 'box-pack', 'box-align'];
const CompatibleValue = ['box'];

const cssPropertyMap = [
    // 布局类
    'display',
    'boxOrient',
    'boxPack',
    'boxAlign',
    'width',
    // 'height',
    'minHeight',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'paddingTop',
    'top',
    'right',
    'bottom',
    'left',
    // 'zIndex'

    // // 属性类

    // "marginLeft",
    // "marginTop",
    // "marginRight",
    // "marginBottom",
    // "left",
    // "right",
    // "top",
    // "bottom",
    // "padding",
    "zIndex",
    "backgroundImage",
    "backgroundColor",
    "backgroundSize",
    "backgroundRepeat",
    "color",
    "fontFamily",
    "fontSize",
    "position",
    // "border",
    // "boxSizing",
    "borderRadius",
    // "overflow",
    // "textOverflow",
    // "boxFlex",
    // "boxOrient",
    // "boxPack",
    // "boxAlign",
    // "display",
    // "textAlign",
    "whiteSpace",
    "lineHeight",
    "opacity"
];

class CssDom {
    constructor(parent, data, layoutType) {
        // 节点的信息
        this.id = data.id;
        this.serialId = data.serialId;
        this.modelId = data.modelId;
        this.type = data.type;
        this.modelName = data.modelName;
        this.canLeftFlex = data.canLeftFlex;
        this.canRightFlex = data.canRightFlex;
        this.isCalculate = data.isCalculate;
        this.tplAttr = data.tplAttr || {};
        this.tplData = data.tplData || {};
        this.similarId = data.similarId;

        this.parent = parent ? parent : this;
        this.layoutType = layoutType;

        // 布局计算的数值
        this._abX = data.abX;
        this._abY = data.abY;
        this._abXops = data.abXops;
        this._abYops = data.abYops;
        this._width = data.width;
        this._height = data.height;
        this._zIndex = data.zIndex;

        // 样式属性
        this.constraints = data.constraints;
        this.path = data.path;
        this.styles = data.styles || {};
        // 子节点
        this.children = [];

    }

    /**
     * 获取当前节点的前一个兄弟节点,若没有则返回null
     */
    _prevNode() {
        if (this.type == Common.QBody) { // 根节点
            return this;
        }

        let len = this.parent.children.length;
        // 只有自己
        if (len <= 1) {
            return null;
        }

        let canBegin = false;
        for (let i = len - 1; i >= 0; i--) {
            let node = this.parent.children[i];

            if (node.id == this.id) {
                // 此时只剩下自己
                if (i <= 0) {
                    return null;
                }
                canBegin = true;
                continue;
            }

            if (canBegin) { // 这里开始就是开始寻找"上一个节点了"
                if (node._isAbsolute()) {
                    continue;
                }

                return node;
            }
        }
    }

    /**
     * 获取当前节点的前一个兄弟节点,若没有则返回null
     */
    _prevNodeWithParam(nodes, curIndex) {
        var index = curIndex - 1;
        while (index >= 0) {
            if (!nodes[index]._isAbsolute()) {
                return nodes[index];
            }
            index--;
        }
        return null;
    }

    /**
     * 获取当前节点的前一个兄弟节点,若没有则返回null
     */
    _nextNodeWithParam(nodes, curIndex) {
        var index = curIndex + 1;
        while (index < nodes.length) {
            if (!nodes[index]._isAbsolute()) {
                return nodes[index];
            }
            index++;
        }
        return null;
    }

    /**
     * 获取当前节点的下一个兄弟节点,若没有则返回null
     */
    _nextNode() {
        if (this.type == Common.QBody) { // 根节点
            return this;
        }

        let len = this.parent.children.length;
        // 只有自己
        if (len <= 1) {
            return null;
        }

        let canBegin = false;
        for (let i = 0; i < len; i++) {
            let node = this.parent.children[i];

            if (node.id == this.id) {
                // 此时只剩下自己
                if (i >= len) {
                    return null;
                }
                canBegin = true;
                continue;
            }

            if (canBegin) { // 这里开始就是开始寻找"下一个节点了"
                if (node._isAbsolute()) {
                    continue;
                }

                return node;
            }
        }
    }

    /**
     * 节点是否属于绝对定位
     */
    _isAbsolute() {
        if (this.constraints['LayoutSelfPosition'] &&
            this.constraints['LayoutSelfPosition'] == Constraints.LayoutSelfPosition.Absolute) {
            return true;
        }

        return false;
    }

    /**
     * 节点的排列是否为横排
     * @returns {Boolean}
     */
    _isParentHorizontal() {
        let res = false; // 默认为竖排
        if (this.parent.children.length == 1) { // 1个元素默认是竖排
            return res;
        }

        if (this.parent &&
            this.parent.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal) {
            res = true;
        }

        return res;
    }

    /**
     * 节点是否为固定宽度节点
     * @param {CssDom} node CssDom节点
     */
    _canLeftFlex() {
        if (this.constraints['LayoutFixedWidth'] == Constraints.LayoutFixedWidth.Fixed ||
            this.texts) {
            return false;
        }
        if (typeof this.canLeftFlex == "boolean") {
            return this.canLeftFlex;
        }
        return true;

    }
    _canRightFlex() {
        if (this.constraints['LayoutFixedWidth'] == Constraints.LayoutFixedWidth.Fixed) {
            return false;
        }
        if (typeof this.canRightFlex == 'boolean') {
            // 不是模板元素, 默认做最大扩展
            return this.canRightFlex;
        }
        return true;
    }

    /**
     * 节点是否为固定宽度节点
     * @param {CssDom} node CssDom节点
     */
    _isFixedHeight(node) {
        let result = false;

        if (!node.modelName) {
            // 不是模板元素, 默认做最大扩展
            return false;
        }

        if (node.constraints['LayoutFixedHeight'] &&
            node.constraints['LayoutFixedHeight'] == Constraints.LayoutFixedHeight.Fixed) {

            result = true;
        } else if (node.modelName) {
            // 有node.modelName 则为非模板生成的元素,可以认为是固定高
            result = true;
        }
        return result;
    }

    /**
     * 边界重定义
     */
    _calculateBoundary() {
        // 跟节点不调整
        if (this.type == Common.QBody) {
            return;
        }
        if (this._isAbsolute()) {
            return;
        }
        let isVertical = this.parent.constraints['LayoutDirection'] == Constraints.LayoutDirection.Vertical;
        this._calculateLeftBoundary(isVertical);
        this._calculateRightBoundary(isVertical);
    }
    // 计算左边界
    _calculateLeftBoundary(isVertical) {
        if (!this._canLeftFlex()) {
            return;
        }
        let prevNode = isVertical ? null : this._prevNode();
        if (!prevNode) {
            this._abX = this.parent._abX;
            return;
        }
        if (prevNode._canRightFlex()) {
            this._abX = Math.floor((prevNode._abXops + this._abX) / 2);
        } else {
            this._abX = prevNode._abXops;
        }
    }
    // 计算左边界
    _calculateRightBoundary(isVertical) {
        if (!this._canRightFlex()) {
            return;
        }
        let nextNode = isVertical ? null : this._nextNode();
        if (!nextNode) {
            this._abXops = this.parent._abXops;
            return;
        }
        if (nextNode._canLeftFlex()) {
            this._abXops = Math.ceil((nextNode._abX + this._abXops) / 2);
        } else {
            this._abXops = nextNode._abX;
        }
    }

    /**
     * 判断是否使用padding
     */
    _usePaddingTop(parent) {
        return parent.constraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical &&
            parent.children.find(nd => !nd._isAbsolute());
    }
    _getFirstChild(node) {
        return node.children.find(nd => !nd._isAbsolute());
    }
    // 约束补充计算
    _supplementConstraints() {
        let children = this.children
        if (children.length == 0) {
            return;
        }
        // }
        let isVertical = children.length > 1 && Utils.isVertical(children),
            baseLine = Utils.calculateBaseLine(this),
            _justifyContent = isVertical ? 'vertical' : 'horizontal',
            _alignItems = isVertical ? 'vertical' : 'horizontal';
        // 约束方向判断
        this.constraints["LayoutDirection"] = this.constraints["LayoutDirection"] ||
            (isVertical ? Constraints.LayoutDirection.Vertical : Constraints.LayoutDirection.Horizontal);
        // 主轴约束补充
        this.constraints["LayoutJustifyContent"] = this.constraints["LayoutJustifyContent"] ||
            (baseLine[_justifyContent + "Center"] && Constraints.LayoutJustifyContent.Center) ||
            (baseLine[_justifyContent + "End"] && Constraints.LayoutJustifyContent.End) ||
            (baseLine[_justifyContent + "Start"] && Constraints.LayoutJustifyContent.Start)
        // 副轴约束补充
        this.constraints["LayoutAlignItems"] = this.constraints["LayoutAlignItems"] ||
            (baseLine[_alignItems + "Center"] && Constraints.LayoutJustifyContent.Center) ||
            (baseLine[_alignItems + "End"] && Constraints.LayoutJustifyContent.End) ||
            (baseLine[_alignItems + "Start"] && Constraints.LayoutJustifyContent.Start)

    }
    // 找到获取最接近的model
    static getClosestModelById(node, id) {
        if (!id) {
            return null;
        }
        if (id == node.id) {
            return node;
        }
        return CssDom.getClosestModelById(node.parent, id);
    }
    /**
     * 获取className
     */
    getClass() {
        let parentClass = '',
            selfClass = '';
        // 如果有modelId,说明当前节点为某模型子元素
        if (this.modelId && this.modelId != this.id) {
            let model = CssDom.getClosestModelById(this, this.modelId);
            parentClass = `.u-${model.serialId}`;
            selfClass = this.tplData.class ? `.${this.tplData.class}` : `.u-${this.serialId}`
        } else {
            selfClass = `.u-${this.serialId}`;
        }
        return [parentClass, selfClass].join(' ');
    }

    /**
     * 获取得到的属性
     */
    getCssProperty(similarData) {
        let props = [];
        // 获取属性值并进行拼接
        let similarCss = similarData[this.similarId] && similarData[this.similarId].css;
        cssPropertyMap.forEach(key => {
            let value = this[key],
                similarValue = similarCss && similarCss[key];
            if (value !== null && similarValue != value) {
                props.push(CssDom.getCssProperty(key, value));
            }
        });
        return props;
    }

    /**
     * 获取该节点的样式
     */
    getCss(similarData) {
        let str = '',
            className = this.getClass(),
            cssArr = this.getCssProperty(similarData);
        if (cssArr.length) {
            str = `${className} {${cssArr.join(';')}}`;
        }
        // !重要, 每次获取当前节点样式信息后
        // 动态计算该节点的子节点的根据约束而生成_abX, _abY, _abXops, _abYops等数据
        return str;
    }

    // 转换过的基于父节点的parentX
    get parentX() {
        return (this._abX - this.parent._abX);
    }
    // 转换过的基于父节点的parentY
    get parentY() {
        return (this._abY - this.parent._abY);
    }
    //
    get display() {
        // -webkit-flex, block, inline-block, inline
        // 竖排默认不返回
        if (this.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal) {
            return '-webkit-box';
        }
        return null;
    }
    //
    get boxOrient() {
        let css = null;
        // start, flex-end, center, space-between, space-around
        if (this.display) {
            // 排列顺序, 先hardcode横排
            css = 'horizontal';
        }
        return css;
    }
    //
    get boxAlign() {
        const axle = this.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal ?
            'LayoutAlignItems' : 'LayoutJustifyContent';
        return {
            'Start': 'start',
            'End': 'end',
            'Center': 'center',
        }[this.constraints[axle]] || null;
    }
    //
    get boxPack() {
        const axle = this.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal ?
            'LayoutJustifyContent' : 'LayoutAlignItems';
        return {
            'Start': 'start',
            'End': 'end',
            'Center': 'center',
        }[this.constraints[axle]] || null;
    }
    //
    get width() {
        return Math.abs(this._abXops - this._abX);
    }
    /**
     * 
     * @param {Array} vals 圆角数组
     * @param {Number} maxSize 圆角最大值
     */
    getRadius(vals, maxSize = 100) {
        var that = this;
        if (!(vals instanceof Array)) {
            vals = [vals];
        }
        return vals.map(v => {
            v = v < maxSize / 2 ? v : maxSize / 2;
            return CssDom.transUnit(v);
        }).join(' ');
    }
    get borderRadius() {
        if (this.styles.borderRadius) {
            return this.getRadius(this.styles.borderRadius, Math.min(this._height, this._width));
        } else {
            return null;
        }
    }
    //
    get height() {
        return Math.abs(this._abYops - this._abY);
    }
    get minHeight() {
        // let firstChild = this._getFirstChild(this.parent);
        let firstChild = this._usePaddingTop(this);
        if (firstChild) {
            return Math.abs(this._abYops - firstChild._abY);
        }
        return Math.abs(this._abYops - this._abY);
    }

    get backgroundColor() {
        if (this.styles && this.styles.background &&
            this.styles.background.type == 'color') {
            return this.getRGBA(this.styles.background.color);
        } else {
            return null;
        }
    }

    //
    get top() {
        let css = null;
        if (false) {
            // 这里是预留给fixed定位约束
            css = this._abY;
        } else if (this._isAbsolute()) {
            css = this.parentY;
        } else {
            return null;
        }
        return css;
    }
    //
    get right() {
        // 暂不处理
        return null;
    }
    //
    get bottom() {
        // 暂不处理
        return null;
    }
    //
    get left() {
        let css = null;
        if (false) {
            // 这里是预留给fixed定位约束
            css = this._abX;
        } else if (this._isAbsolute()) {
            css = this.parentX;
        } else {
            return null;
        }
        return css;
    }
    get position() {
        if (this._isAbsolute()) {
            return "absolute";
        } else {
            return "relative";
        }
        // if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
        //     return "absolute";
        // } else if (this.constraints["LayoutPosition"] == Constraints.LayoutPosition.Absolute) {
        //     return "relative";
        // }/*  else if (this.constraints["LayoutPosition"] == Constraints.LayoutPosition.Static) {
        //     return "static"
        // } */
    }
    //
    get marginTop() {
        let css = null;
        if (this._isAbsolute()) {
            return css;
        }
        let firstChild = this._usePaddingTop(this.parent);
        if (firstChild == this) {
            return null;
        }
        if (this._isParentHorizontal()) { // 横排计算与父节点距离
            // 如果垂直居中、底对齐则无margin-Top
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Center) {
                return null;
            }
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.End) {
                return null;
            }
            // LayoutAlignItems.Start
            css = this._abY - this.parent._abY;
        } else { // 竖排计算与上一节点距离
            let preNode = this._prevNode();
            /**
             * 由于垂直方向使用block，所以统一默认约束为Constraints.LayoutJustifyContent.Start
             */
            /* if (!preNode &&
                this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.Center) {
                return null;
            }
            if (this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.End) {
                return null;
            } */

            // LayoutJustifyContent.Start
            if (preNode) {
                css = this._abY - preNode._abYops;
            } else {
                css = this._abY - this.parent._abY;
            }
        }
        return css;
    }

    get paddingTop() {
        let css = null;
        // let firstChild = this._getFirstChild(this);
        let firstChild = this._usePaddingTop(this);
        if (firstChild) {
            return firstChild._abY - this._abY;
        }
        return css;
    }
    //
    get marginRight() {
        let css = null;
        if (this._isAbsolute()) {
            return css;
        }

        if (this._isParentHorizontal()) { // 横排计算与上一节点距离
            let nextNode = this._nextNode();

            // 如果水平左对齐
            if (this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.Start) {
                return null;
            }
            // 如果水平居中
            if (!nextNode &&
                this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.Center) {
                return null;
            }

            if (nextNode) {
                css = this._abX - nextNode._abXops;
            } else {
                css = this._abX - this.parent._abX;
            }
        } else { // 竖排计算与父节点距离
            // 如果水平居中、或水平右对齐
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Center) {
                return 'auto';
            }
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Start) {
                return null;
            }
            // LayoutAlignItems.End
            css = this.parent._abXops - this._abXops;
            return null;
        }
        return css;
    }
    //
    get marginBottom() {
        if (this._isAbsolute()) {
            return null;
        }
        if (this._isParentHorizontal()) { // 横排计算与父节点距离
            // 如果垂直居中、底对齐则无margin-Top
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Center) {
                return null;
            }
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Start) {
                return null;
            }
            // LayoutAlignItems.Start
            return this.parent._abYops - this._abYops;
        } else { // 竖排计算与上一节点距离
            /**
             * 由于垂直方向使用block，所以统一默认约束为Constraints.LayoutJustifyContent.Start
             */
            /* 
            let nextNode = this._nextNode();
            if (!nextNode &&
                this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.Center) {
                return null;
            }
            if (this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.Start) {
                return null;
            }

            // LayoutJustifyContent.Start
            if (nextNode) {
                css = this._abY - nextNode._abYops;
            } else {
                css = this._abY - this.parent._abY;
            } */
            return null;
        }
    }
    //
    get marginLeft() {
        let css = null;
        if (this._isAbsolute()) {
            return css;
        }

        if (this._isParentHorizontal()) { // 横排计算与上一节点距离
            let preNode = this._prevNode();

            // 如果水平居中、或水平右对齐，第一个子节点无margin-left
            if (!preNode && this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.Center) {
                return null;
            }
            if (this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.End) {
                return null;
            }
            // LayoutJustifyContent.Start
            if (preNode) {
                css = this._abX - preNode._abXops;
            } else {
                css = this._abX - this.parent._abX;
            }
        } else { // 竖排计算与父节点距离
            // 如果水平居中、或水平右对齐
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Center) {
                return 'auto';
            }
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.End) {
                return null;
            }
            // LayoutAlignItems.Start
            css = this._abX - this.parent._abX;
        }
        return css;
    }
    //
    get zIndex() {
        if (this._isAbsolute() && this._zIndex) {
            return this._zIndex;
        }
        return null;
    }
    //
    get color() {
        if (this.styles && this.styles.texts) {
            return this.getRGBA(this.styles.texts[0].color);
        } else {
            return null;
        }
    }

    get fontFamily() {
        if (this.styles.texts) {
            return this.styles.texts[0].font;
        }
        return null;
    }

    get fontSize() {
        if (this.styles && this.styles.texts) {
            return CssDom.transUnit(this.styles.texts[0].size);
        } else {
            return null;
        }
    }

    get lineHeight() {
        if (this.styles.texts) {
            // 清洗行高，本应由数据源清洗
            return this.styles.lineHeight ||
                Math.round(Math.max(...this.styles.texts.map(t => t.size)))
        } else {
            return null;
        }
    }
    get opacity() {
        if (typeof this.styles.opacity == 'number') {
            return this.styles.opacity;
        } else {
            return null;
        }
    }

    get whiteSpace() {
        if (this._height / this.lineHeight < 1.2) {
            return 'nowrap';
        }
        return null;
    }

    /**
     * 获取线性渐变值
     * @param {Color} bgColor 背景色
     * @param {Number} width 宽度
     * @param {Number} height 高度
     */
    getLinearGradient(bgColor, width, height) {
        const from = {
            x: bgColor.x * width,
            y: bgColor.y * height
        };
        const to = {
            x: bgColor.x1 * width,
            y: bgColor.y1 * height
        };
        let stops = [];
        let rad = Math.atan((from.y - to.y) / (to.x - from.x))
        let angle = rad * 180 / Math.PI;
        angle += from.x > to.x ? -180 : 0
        let isHorizontal = angle % 180 == 0;
        bgColor.colorStops.forEach((stop) => {
            stops.push({
                color: this.getRGBA(stop.color),
                offset: stop.offset
            });
        });
        let gradientLength = Math.abs(isHorizontal ? (width / Math.cos(rad)) : (height / Math.sin(rad)));
        let linearLength = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
        let w = from.x < to.x ? from.x : (width - from.x),
            h = from.y < to.y ? from.y : (height - from.y)
        let beginLength = Math.abs(isHorizontal ? (w / Math.cos(rad)) : (h / Math.sin(rad)));
        stops.forEach((s) => {
            s.offset = (s.offset * linearLength + beginLength) / gradientLength
        });
        return `-webkit-linear-gradient(${angle}deg, ${stops.map((s) => {
            return s.color + ' ' + (s.offset * 100) + '%';
        }).join(',')})`;
    }

    compareStyle() {

    }

    get backgroundImage() {
        if (this.styles.background &&
            this.styles.background.type == 'linear') {
            return this.getLinearGradient(this.styles.background, this._width, this._height);
        } else if (this.path) {
            return `url(../${this.path})`;
        } else {
            return null;
        }
    }
    get backgroundSize() {
        if (this.path) {
            return 'contain';
        } else {
            return null;
        }
    }
    getRGBA(color) {
        if (color && typeof color == 'object') {
            return 'rgba(' + [
                color.r,
                color.g,
                color.b,
                color.a,
            ].join(',') + ')'
        }
        return null;
    }

    get backgroundRepeat() {
        var css = null;
        if (this.path) {
            css = 'no-repeat';
        }
        return css;
    }

    static getCssProperty(key, value) {
        if (!isNaN(value) && key != "opacity" && key != "zIndex") { // 数字的话进行单位转换
            value = CssDom.transUnit(value);
        }

        let name = Utils.nameLower(key);
        if (CompatibleKey.includes(name)) {
            const webkitName = '-webkit-' + name;
            return `${webkitName}: ${value}`;
        } else {
            return `${name}: ${value}`;
        }
    }
    /**
     * 单位换算
     * @param  {Number} number 数值
     * @param  {String} unit   单位类型，默认px
     * @return {String}        数值+单位
     */
    static transUnit(number, unit = "rem") {
        number = parseInt(number) || 0;
        const dpr = 2;
        // 1-2像素特殊处理
        if (Math.abs(number) <= dpr) {
            number = Math.ceil(number / dpr);
            unit = 'px';
        }
        if (unit == 'rem') {
            return number / 100 + 'rem';
        } else {
            return number + 'px';
        }
    }
}


module.exports = {
    process,
    CssDom,
    getCssString
}