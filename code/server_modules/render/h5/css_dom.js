// 样式的计算处理
const Common = require('../../dsl2/dsl_common.js');
const Constraints = require('../../dsl2/dsl_constraints.js');
const Utils = require('../utils');
const Path = require('path');
const Config = require('../config');

const QLog = require("../../log/qlog");
const Loger = QLog.getInstance(QLog.moduleData.render);
// 生成的Css记录树
let cssDomTree = null,
    cssDomArr;

// 主流程
let process = function (data, layoutType) {
    // 构建cssTree并返回
    Loger.debug(`css_dom.js [process]`);
    cssDomArr = [];

    Loger.debug(`css_dom.js [_buildTree]`)
    _buildTree(null, data, layoutType);

    Loger.debug(`css_dom.js [_parseConstraints]`)
    _parseConstraints(cssDomTree);

    Loger.debug(`css_dom.js [_parseBoundary]`)
    _parseBoundary(cssDomTree);
    return cssDomTree;
}

let getCssString = function (cssDomTree, similarData) {
    // 获取cssTree解析出的样式
    let css = []; // 每个CssDom节点返回的样式数组
    _parseTree(css, cssDomTree, similarData);
    return css.join('\n');
}

let getCssMap = function (cssDomTree) {
    // 获取cssTree解析出的样式
    let css = {}; // 每个CssDom节点返回的样式数组
    _parseMap(css, cssDomTree);
    return css;
}

let getCssDomArr = function () {
    return cssDomArr;
}

/**
 * 构建cssDom树
 * @param {Object} parent 
 * @param {Json} data 
 * @param {Int} layoutType 
 */
let _buildTree = function (parent, data, layoutType) {
    try {
        let cssNode = new CssDom(parent, data, layoutType);
        cssDomArr.push(cssNode);
        // 构建树
        if (!parent) {
            cssDomTree = cssNode;
        } else {
            parent.children.push(cssNode);
        }
        data.children.forEach(data => {
            _buildTree(cssNode, data, layoutType);
        });
        return cssNode;
    } catch (e) {
        Loger.error(`css_dom.js [_buildTree] ${e},params[parent.id:${parent&&parent.id},data.id:${data&&data.id}]`)
    }
}
/**
 * 约束补充
 * @param {Tree} tree 
 */
let _parseConstraints = function (tree) {
    try {
        tree.children.forEach(cn => {
            _parseConstraints(cn);
        })
        tree._supplementConstraints();
    } catch (e) {
        Loger.error(`css_dom.js [_parseConstraints] ${e},params[tree.id:${tree&&tree.id}]`)
    }
}
/**
 * 边界补充
 * @param {Tree} tree 
 */
let _parseBoundary = function (tree) {
    try {
        tree._calculateBoundary();
        tree.children.forEach(cn => {
            _parseBoundary(cn);
        })
    } catch (e) {
        Loger.error(`css_dom.js [_parseBoundary] ${e},params[tree.id:${tree&&tree.id}]`)
    }

}
/**
 * 解析获取css属性
 * @param {Array} arr 字符串收集数组
 * @param {CssDom} dom CssDom节点
 */
let _parseTree = function (arr, dom, similarData) {
    try {
        let similarCss = similarData[dom.similarId] && similarData[dom.similarId].css;
        let str = dom.getCss(similarCss);
        if (str) {
            arr.push(str);
        }

        dom.children.forEach(child => {
            _parseTree(arr, child, similarData);
        });
    } catch (e) {
        Loger.error(`css_dom.js [_parseTree] ${e},params[dom.id:${dom&&dom.id}]`)
    }
}
/**
 * 解析获取css属性
 * @param {Array} arr 字符串收集数组
 * @param {CssDom} dom CssDom节点
 */
let _parseMap = function (map, dom) {
    try {
        map[dom.id] = dom;

        dom.children.forEach(child => {
            _parseMap(map, child);
        });
    } catch (e) {
        Loger.error(`css_dom.js [_parseMap] ${e},params[dom.id:${dom&&dom.id}]`)
    }
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
    //'height',
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
    // // 属性类
    "zIndex",
    "backgroundImage",
    "backgroundColor",
    "backgroundSize",
    "backgroundRepeat",
    "color",
    "fontFamily",
    "fontSize",
    "position",
    "filter",
    "border",
    // "boxSizing",
    "borderRadius",
    "overflow",
    "textOverflow",
    // "boxFlex",
    "textAlign",
    "whiteSpace",
    "lineHeight",
    "opacity"
];

class CssDom {
    constructor(parent, data, layoutType) {
        // 节点的信息
        this.id = data.id;
        this.tagName = data.tagName;
        this.serialId = data.serialId;
        this.modelId = data.modelId;
        this.type = data.type;
        this.modelName = data.modelName;
        this.canLeftFlex = data.canLeftFlex;
        this.canRightFlex = data.canRightFlex;
        this.isCalculate = data.isCalculate;
        this.tplAttr = data.tplAttr || {};
        this.similarId = data.similarId;
        this.parent = parent ? parent : null;
        this.layoutType = layoutType;

        // 布局计算的数值
        this._abX = data.abX;
        this._abY = data.abY;
        this._abXops = data.abXops;
        this._abYops = data.abYops;
        this._width = data.width;
        this._height = data.height;
        this._zIndex = data.zIndex;
        this._hasText = !!data.text;

        // 样式属性
        this.constraints = data.constraints;
        this.path = data.path;
        this.styles = data.styles || {};
        // 子节点
        this.children = [];

        this.selfCssName = data.selfCssName || [];
        this.similarCssName = data.similarCssName || [];
    }

    /**
     * 获取当前节点的前一个兄弟节点,若没有则返回null
     */
    _prevNode() {
        if (this.type == Common.QBody) { // 根节点
            return null;
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
            return null;
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

    _isTextCenter() {
        if (!this._hasText) {
            return null;
        }
        if (this._canLeftFlex() && this._canRightFlex()) {
            return true;
        }
        if (this.parent.constraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical && this.parent.constraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Center) {
            return true;
        }
        if (this.parent.constraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal && this.parent.constraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Center) {
            return true;
        }


    }

    _isImgTag() {
        return this.tagName == 'img';
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
     * 父节点是否属于相对定位
     */
    _isRelative() {
        if (this.parent && this.parent.constraints['LayoutPosition'] == Constraints.LayoutPosition.Absolute) {
            return true;
        }
        return false;

    }
    /**
     * 节点的排列是否为横排
     * @returns {Boolean}
     */
    _isParentHorizontal() {
        if (!this.parent) {
            return false;
        }
        if (this.parent.children.length == 1) { // 1个元素默认是横排
            return true;
        }

        if (this.parent &&
            this.parent.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal) {
            return true;
        }

        return false; // 默认为竖排
    }

    /**
     * 节点是否为固定宽度节点
     * @param {CssDom} node CssDom节点
     */
    _canLeftFlex() {
        if (this.constraints['LayoutFixedWidth'] == Constraints.LayoutFixedWidth.Fixed) {
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
            this._abXops = this._abXops < this.parent._abXops ? this.parent._abXops : this._abXops;
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
        return parent && parent.constraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical &&
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
        let isVertical = children.length > 1 && Utils.isVertical(children),
            baseLine = Utils.calculateBaseLine(this),
            _justifyContent = isVertical ? 'vertical' : 'horizontal',
            _alignItems = isVertical ? 'horizontal' : 'vertical';
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

        /**
         * H5约束修正：
         */

    }
    // 找到获取最接近的model
    static getClosestModelById(node, id) {
        try {
            if (!id || !node) {
                return null;
            }
            if (id == node.id) {
                return node;
            }
            return CssDom.getClosestModelById(node.parent, id);
        } catch (e) {
            Loger.error(`css_dom.js [getClosestModelById],params:[id:${id}]`)
        }
    }
    /**
     * 获取className
     */
    getClass() {
        return this.selfCssName.map(n => '.' + n).join(' ')
    }

    /**
     * 获取得到的属性
     */
    getCssProperty(similarCss) {
        try {
            let props = [];
            // 获取属性值并进行拼接
            cssPropertyMap.forEach(key => {
                let value = this[key],
                    similarValue = similarCss && similarCss[key];
                if (value != null && value != undefined && similarValue != value) {
                    props.push(CssDom.getCssProperty(key, value));
                }
            });
            return props;
        } catch (e) {
            Loger.error(`css_dom.js [this.getCssProperty] ${e}, params[this.id:${this.id},${similarCss}]`)
        }
    }

    /**
     * 获取该节点的样式
     */
    getCss(similarCss) {
        let str = '',
            className = this.getClass(),
            cssArr = this.getCssProperty(similarCss);
        if (cssArr.length) {
            str = `${className} {${cssArr.join(';')}}`;
        }
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
        return 'block';
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
        } [this.constraints[axle]] || null;
    }
    //
    get boxPack() {
        const axle = this.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal ?
            'LayoutJustifyContent' : 'LayoutAlignItems';
        return {
            'Start': 'start',
            'End': 'end',
            'Center': 'center',
        } [this.constraints[axle]] || null;
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
    get border() {
        if (this.styles.border && this.styles.border.width) {
            let borderType = CssDom.borderType(this.styles.border.type),
                borderWidth = CssDom.transUnit(this.styles.border.width),
                borderColor = CssDom.getRGBA(this.styles.border.color);
            return [borderWidth, borderType, borderColor].join(' ');
        }
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
        if (this._isImgTag()) {
            return null;
        }
        if (this.styles && this.styles.background &&
            this.styles.background.type == 'color') {
            return CssDom.getRGBA(this.styles.background.color);
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
            return 0;
        }
        if (this._isParentHorizontal()) { // 横排计算与父节点距离
            // 如果垂直居中、底对齐则无margin-Top
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Center) {
                return 0;
            }
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.End) {
                return 0;
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
            } else if (this.parent) {
                css = this._abY - this.parent._abY;
            } else {
                css = this._abY;
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
                return 0;
            }
            // 如果水平居中
            if (this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.Center) {
                return 0;
            }

            if (nextNode) {
                return nextNode._abX - this._abXops;
            } else {
                return this.parent._abXops - this._abXops;
            }
        } else { // 竖排计算与父节点距离
            // 如果水平居中、或水平右对齐
            if (this.parent && this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Center) {
                return 'auto';
            }
            if (this.parent && this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Start) {
                return 0;
            }
            if (this.parent && this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.End) {
                return this.parent._abXops - this._abXops;
            }
            return null;
        }
    }
    //
    get marginBottom() {
        if (this._isAbsolute()) {
            return 0;
        }
        if (this._isParentHorizontal()) { // 横排计算与父节点距离
            // 如果垂直居中、底对齐则无margin-Top
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Center) {
                return 0;
            }
            if (this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Start) {
                return 0;
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
            return 0;
        }
    }
    //
    get marginLeft() {
        let css = 0;
        if (this._isAbsolute()) {
            return css;
        }


        if (this._isParentHorizontal()) { // 横排计算与上一节点距离
            let preNode = this._prevNode();

            // 如果水平居中、或水平右对齐，第一个子节点无margin-left
            if (this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.Center &&
                !preNode) {
                return 0;
            }
            if (this.parent.constraints.LayoutJustifyContent == Constraints.LayoutJustifyContent.End) {
                return 0;
            }
            // LayoutJustifyContent.Start
            if (preNode) {
                return this._abX - preNode._abXops;
            } else {
                return this._abX - this.parent._abX;
            }
        } else { // 竖排计算与父节点距离
            // 如果水平居中、或水平右对齐
            if (this.parent && this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.Center) {
                return 'auto';
            } else if (this.parent && this.parent.constraints.LayoutAlignItems == Constraints.LayoutAlignItems.End) {
                return 0;
            } else if (this.parent) {
                return this._abX - this.parent._abX;
            }
            return this._abX;
        }
    }
    // 
    get zIndex() {
        if (this._isAbsolute()) {
            return this._zIndex;
        }
        // return null;
    }
    //
    get color() {
        if (this.styles && this.styles.texts) {
            return CssDom.getRGBA(this.styles.texts[0].color);
        } else {
            return null;
        }
    }
    get overflow() {
        // if(this.children)
        if (this.width == Common.DesignWidth && Utils.calRange(this.children).width > this.width) {
            return 'auto'
        }
        if (this.styles.texts) {
            return 'hidden';
        }
        return null;
    }
    get textOverflow() {
        if (this.styles.texts) {
            return 'ellipsis';
        }
        return null;
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

    get textAlign() {
        if (this._isTextCenter()) {
            return 'center';
        }
        return null;
    }
    get filter() {
        if (this.styles && this.styles.shadows) {
            let filter = [];
            this.styles.shadows.forEach((s, i) => {
                filter.push('drop-shadow(' + [
                    CssDom.transUnit(s.x),
                    CssDom.transUnit(s.y),
                    CssDom.transUnit(s.blur),
                    CssDom.getRGBA(s.color),
                ].join(' ') + ')');
            })
            return filter.join(' ');
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
                color: CssDom.getRGBA(stop.color),
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


    get backgroundImage() {
        if (this._isImgTag()) {
            return null;
        }
        if (this.styles.background &&
            this.styles.background.type == 'linear') {
            return this.getLinearGradient(this.styles.background, this._width, this._height);
        } else if (this.path) {
            let relativePath = Path.relative(Config.HTML.output.cssPath, Config.HTML.output.imgPath);
            return `url(./${relativePath}/${this.path})`
        } else {
            return null;
        }
    }
    get backgroundSize() {
        if (this._isImgTag()) {
            return null;
        }
        if (this.path) {
            return 'contain';
        } else {
            return null;
        }
    }

    get backgroundRepeat() {
        if (this._isImgTag()) {
            return null;
        }
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
    static getRGBA(color) {
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
    /**
     * 转换sketch中border类型
     * @param  {Number} dash sketch边框宽度
     * @return {String}      border-type
     */
    static borderType(style) {
        if (!style) {
            return 'solid';
        }
        if (style.dash > 4) {
            return "dashed"
        } else if (style.dash > 1) {
            return "dotted"
        }
        return 'solid';
    }
}


module.exports = {
    CssDom,
    process,
    getCssDomArr,
    getCssString,
    getCssMap
}