// 样式的计算处理

const Common = require('../../dsl2/dsl_common.js');
const Constraints = require('../../dsl2/dsl_contrain.js');

let getRadius = function (vals, maxSize = 100) {
    if (!(vals instanceof Array)) {
        vals = [vals];
    }
    return vals.map(v => {
        v = v < maxSize / 2 ? v : maxSize / 2;
        return transUnit(v);
    }).join(' ');
}
let transUnit = function (number, unit = 'rem', dpr = 2) {
    number = parseInt(number) || 0;
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

let getAlign = function (type) {
    return {
        "0": "left",
        "1": "right",
        "2": "center",
        "start": "left",
        "end": "right"
    }[type]

}

let getRGBA = function (color) {
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
let calLinearGradient = function (bgColor, width, height) {
    const from = {
        x: bgColor.pX * width,
        y: bgColor.pY * height
    };
    const to = {
        x: bgColor.pX1 * width,
        y: bgColor.pY1 * height
    };
    let stops = [];
    let rad = Math.atan((from.pY - to.pY) / (to.pX - from.pX))
    let angle = rad * 180 / Math.PI;
    angle += from.pX > to.pX ? -180 : 0
    let isHorizontal = angle % 180 == 0;
    bgColor.colorStops.forEach((stop) => {
        stops.push({
            color: Render.toRGBA(stop.color),
            offset: stop.offset
        });
    });
    let gradientLength = Math.abs(isHorizontal ? (width / Math.cos(rad)) : (height / Math.sin(rad)));
    let linearLength = Math.sqrt(Math.pow(to.pX - from.pX, 2) + Math.pow(to.pY - from.pY, 2))
    let w = from.pX < to.pX ? from.pX : (width - from.pX),
        h = from.pY < to.pY ? from.pY : (height - from.pY)
    let beginLength = Math.abs(isHorizontal ? (w / Math.cos(rad)) : (h / Math.sin(rad)));
    stops.forEach((s) => {
        s.offset = (s.offset * linearLength + beginLength) / gradientLength
    });
    return `-webkit-linear-gradient(${angle}deg, ${stops.map((s) => {
        return s.color + ' ' + (s.offset * 100) + '%';
    }).join(',')})`;
}

// 生成的Css记录树
// 
let process = function (data, layoutType) {
    // 构建cssTree并返回
    return _buildTree(null, data.children, layoutType);
}
function getClassKey(key, prefix = '-webkit-') {
    return CompatibleKey.includes(key) ? prefix + key : key;
}
function getClassValue(value, prefix = '-webkit-') {
    return CompatibleValue.includes(value) ? prefix + value : value;
}
let getCssString = function (cssTree) {
    // 获取cssTree解析出的样式
    let css = [];

    _parseTree(css, cssTree);
    return css.join('');
}

/**
 * 构建cssDom树
 * @param {Object} parent 
 * @param {Json} data 
 * @param {Int} layoutType 
 */
let _buildTree = function (parent, data, layoutType) {
    let cssDomTree = new CssDom(parent, data, layoutType);
    data.children && data.children.forEach(child => {
        cssDomTree.children.push(
            _buildTree(data, child, layoutType)
        )
    });
    return cssDomTree;
}

/**
 * 解析获取css属性
 * @param {Array} arr 字符串收集数组
 * @param {CssDom} dom CssDom节点
 */
let _parseTree = function (arr, dom) {
    let str = dom.getCss();
    arr.push(str);

    dom.children.forEach(child => {
        _parseTree(arr, child);
    });
}

const CompatibleKey = ['box-flex', 'box-orient', 'box-pack', 'box-align']
const CompatibleValue = ['box']
// 布局的属性
const cssPropertyMap = [
    "marginLeft",
    "marginTop",
    "marginRight",
    "marginBottom",
    "left",
    "right",
    "top",
    "bottom",
    "filter",
    "width",
    "height",
    "backgroundImage",
    "backgroundColor",
    "backgroundSize",
    "backgroundRepeat",
    "color",
    "fontFamily",
    "fontSize",
    "position",
    "border",
    "boxSizing",
    "borderRadius",
    "boxOrient",
    "boxPack",
    "boxAlign",
    "display",
    "textAlign",
    "lineHeight",
    "opacity"
]


class CssDom {
    constructor(parent, data, layoutType) {
        // 节点的信息
        this.id = data.id;
        this.type = data.type;
        this.modelName = data.modelName;
        this.canLeftFlex = data.canLeftFlex;
        this.canRightFlex = data.canRightFlex;
        this.isCalculate = data.isCalculate;
        this.tplAttr = data.tplAttr;
        this.tplData = data.tplData;

        this.parent = parent ? parent : null;

        this.layoutType = layoutType;


        // 布局计算的数值
        this._abX = data.abX;
        this._abY = data.abY;
        this._abXops = data.abXops;
        this._abYops = data.abYops;
        this._width = data.width;
        this._height = data.height;

        // 样式属性
        this.constraints = data.constraints;
        this.parentConstraints = parent && parent.constraints || {};
        this.style = data.style;
        // 子节点
        this.children = [];
    }
    /**
     * 节点是否为固定宽度节点
     * @param {CssDom} node CssDom节点
     */
    _isFixedWidth(node) {
        let result = false;

        if (node.constraints['LayoutFixedWidth']
            && node.constraints['LayoutFixedWidth'] == Constraints.LayoutFixedWidth.Fixed) {

            result = true;
        }
        else if (node.modelName && (node.canLeftFlex || node.canRightFlex)) {
            // 有node.modelName 则为不是模板生成的元素
            result = true;
        }
        return result;
    }

    /**
     * 节点是否为固定宽度节点
     * @param {CssDom} node CssDom节点
     */
    _isFixedHeight(node) {
        let result = false;

        if (node.constraints['LayoutFixedHeight']
            && node.constraints['LayoutFixedHeight'] == Constraints.LayoutFixedHeight.Fixed) {

            result = true;
        }
        else if (node.modelName) {
            // 有node.modelName 则为非模板生成的元素,可以认为是固定高
            result = true;
        }
        return result;
    }

    /**
     * !重要,_calculateConstraints主要是对模板里的元素(ref, 非ref进行约束计算)
     * 计算出模板里面各元素的位置, abX, abY, abXops, abYops
     */
    _calculateConstraints(node) {
        if (node.children.length == 0) {
            return;
        }

        // 横排的计算
        if (node.constraints['LayoutDirection']
            && node.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal) {

            this._calculateHorizontal(node, node.children);
        }
        else {
            this._calculateVertical(node, node.children);
        }
    }

    /**
     * 计算模板横向的约束
     * @param {Node} parent 父节点
     * @param {Array} nodes 子节点
     */
    _calculateHorizontal(parent, nodes) {
        // 计算前节点的右边, 和当前节点的左边, for后等于计算了所有节点的左右边界
        // console.log('_calculateCssHorizontal');
        let len = nodes.length;
        for (let i = 0; i < len; i++) {
            let preNode = nodes[i - 1];
            let curNode = nodes[i];
            let nxtNode = nodes[i + 1];

            if (curNode.isCalculate) {
                // 有模型名称的为模板外面节点,已经在dsl_layout处计算完毕
                continue;
            }

            // 处理abX, abXops计算
            if (!preNode) {     // 只需处理curNode
                if (curNode.canLeftFlex && !this._isFixedWidth(curNode)) {
                    curNode._abX = parent._abX;
                }
            }
            else {  // 处理preNode和curNode的情况 2*2=4种情况
                if (preNode.canRightFlex && !curNode.canLeftFlex) {
                    preNode._abXops = curNode._abX;
                    //curNode._abX = curNode._abX;
                }
                else if (!preNode.canRightFlex && curNode.canLeftFlex) {
                    //preNode._abXops = preNode._abXops;
                    curNode._abX = preNode._abXops;
                }
                else if (preNode.canRightFlex && curNode.canLeftFlex) {
                    // 各占一半空间
                    let half = (curNode._abX - preNode._abXops) / 2;
                    preNode._abXops += half;
                    curNode._abX -= half;
                }
                else {
                    // !preNode.canRightFlex && !curNode.canLeftFlex
                    // 不用处理了, 固定不动
                }

                // 如果没有下一个节点了, 就把curNode的右边界也处理了
                if (!nxtNode) {
                    if (curNode.canRightFlex && !this._isFixedWidth(curNode)) {
                        curNode._abXops = parent._abXops;
                    }
                }
            }

            // 处理abY, abYops计算
            if (!curNode.modelName) {   // 模板动态元素
                curNode._abY = parent._abY;
                curNode._abYops = parent._abYops;
            }
        }
    }

    /**
     * 计算模板竖向的约束
     * @param {Node} parent 父节点
     * @param {Array} nodes 子节点
     */
    _calculateVertical(parent, nodes) {
        // 竖向的计算只需计算模板动态新增元素的上下距离
        // node.modelName为空即node为模板动态元素
        // console.log('_calculateCssVertical');
        let len = nodes.length;

        if (len == 1) {
            // 处理上下距离
            if (!nodes[0].modelName) {  // 模板非模型元素节点
                nodes[0]._abY = parent._abY;
                nodes[0]._abYops = parent._abYops;
            }

            // 处理左右距离
            if (curNode.canLeftFlex) {
                curNode._abX = parent._abX;
            }
            else if (curNode.canRightFlex) {
                curNode._abXops = parent._abXops;
            }

            return;
        }

        for (let i = 0; i < len; i++) {
            let preNode = nodes[i - 1];
            let curNode = nodes[i];
            let nxtNode = nodes[i + 1];

            if (curNode.isCalculate) {
                // 有模型名称的为模板外面节点,已经在dsl_layout处计算完毕
                continue;
            }

            if (!preNode) {
                if (!this._isFixedHeight(curNode)) {
                    curNode._abY = parent._abY;
                }
            }
            else {  // 处理preNode和curNode的情况4种情况
                if (!preNode.modelName && curNode.modelName) {
                    preNode._abYops = curNode._abY;
                    //curNode._abY = curNode._abY;
                }
                else if (preNode.modelName && !curNode.modelName) {
                    //preNode._abYops = preNode._abYops;
                    curNode._abY = preNode._abYops;
                }
                else if (!preNode.modelName && !curNode.modelName) {
                    // 各占一半
                    let half = (curNode._abY - preNode._abYops) / 2;
                    preNode._abYops += half;
                    curNode._abY -= half;
                }
                else {
                    // preNode.modelName && curNode.modelName
                    // 不用处理, 都是模型元素
                }

                // 如果没有下一个节点了, 就把curNode的下边界也处理了
                if (!nxtNode) {
                    // 由于是竖排,不需往下扩展
                    curNode._abYops = curNode._abYops;
                }
            }

            // 处理左右距离
            if (curNode.canLeftFlex) {
                curNode._abX = parent._abX;
            }
            else if (curNode.canRightFlex) {
                curNode._abXops = parent._abXops;
            }
        }
    }

    get prevNode() {
        if (!this.parentNode) {
            return null;
        }
        let endIndex = this.parentNode.children.indexOf(this)
        return this.parentNode.children.find((child, i) => {
            return endIndex < i && child.contrains != Contrain.LayoutSelfPosition.Absolute
        })
    }
    get nextNode() {
        if (!this.parentNode) {
            return null;
        }
        let startIndex = this.parentNode.children.indexOf(this)
        return this.parentNode.children.find((child, i) => {
            return i > startIndex && child.contrains != Contrain.LayoutSelfPosition.Absolute
        });
    }

    getClass() {
        return `[${this.id}]`;
    }

    getCssProperty() {
        let cssArr = [];
        cssPropertyMap.forEach(key => {
            let value = getClassValue(this[key]);
            let key = getClassKey(key);
            if (value) {
                cssArr.push(`${key}:${value};`);
            }
        });
        return cssArr.join('');
    }

    getCss() {
        let str = '';
        //str = this.width;
        //console.log(this.abX)
        // console.log('modelName: ' + this.modelName);
        // console.log('abX: ' + this.abX);
        // console.log('abY: ' + this.abY);
        // console.log('width: ' + this.width);
        // console.log('height: ' + this.height);
        // console.log('---------------------------');

        // !重要, 每次获取当前节点样式信息后
        // 动态计算该节点的子节点的根据约束而生成_abX, _abY, _abXops, _abYops等数据
        this._calculateConstraints(this);

        return `${this.getClass()}{
            ${this.getCssProperty()}
        }`;
    }

    get width() {
        return Math.abs(this._abXops - this._abX);
    }

    get height() {
        return Math.abs(this._abYops - this._abY);
    }

    // 转换过的基于父节点的abX
    get pX() {
        return (this._abX - this.parentNode._abX);
    }

    // 转换过的基于父节点的abY
    get pY() {
        return (this._abY - this.parentNode._abY);
    }
    /* position */
    get left() {
        if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute &&
            this.constraints["LayoutSelfHorizontal"] == Constraints.LayoutSelfHorizontal.Left) {
            return transUnit(this.pX);
        }
    }
    get right() {
        if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute &&
            this.constraints["LayoutSelfHorizontal"] == Constraints.LayoutSelfHorizontal.Right) {
            return transUnit(this.parentNode.width - this.pX - this.width);
        }

    }
    get top() {
        if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute &&
            this.constraints["LayoutSelfVertical"] == Constraints.LayoutSelfVertical.Top) {
            return transUnit(this.pY);
        }
    }
    get bottom() {
        if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute &&
            this.constraints["LayoutSelfVertical"] == Constraints.LayoutSelfVertical.Bottom) {
            return transUnit(this.parentNode.height - this.pY - this.height);
        }
    }

    get borderRadius() {
        if (this.styles.borderRadius) {
            return getRadius(this.styles.borderRadius, Math.min(this.height, this.width));
        }
    }
    get marginLeft() {

        // 自身约束
        if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return;
        }
        if (this.constraints["LayoutSelfHorizontal"]) {
            // 自身约束
            if (this.constraints["LayoutSelfHorizontal"] == Constraints.LayoutSelfHorizontal.Left) {
                return transUnit(this.pX - this.prevNode ? (this.prevNode.pX + this.prevNode.width) : 0);
            }
        } else if (this.parentConstraints["LayoutDirection"]) {
            // 父级约束
            if (this.parentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
                // 水平
                if (this.parentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Center) {
                    // 居中
                    return this.prevNode ? transUnit(this.pX - this.prevNode.pX - this.prevNode.width) : null;
                } else if (this.parentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Start) {
                    // 左对齐
                    return transUnit(this.prevNode ? (this.pX - this.prevNode.pX - this.prevNode.width) : this.pX);
                }
            } else if (this.parentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical) {
                // 垂直
                if (this.parentConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Center) {
                    // 居中
                    return 'auto'
                } else if (this.parentConstraints["LayoutAlignItems"] != Constraints.LayoutAlignItems.Start) {
                    return transUnit(this.pX);
                }
            }
        }

    }
    get _marginTop() {
        if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.constraints["LayoutSelfVertical"]) {
            if (this.constraints["LayoutSelfVertical"] == Constraints.LayoutSelfVertical.Top) {
                // 顶对齐
                return transUnit(this.prevNode ?
                    (this.pY - this.prevNode.pY - this.parentNode.height) :
                    this.pY
                );
            }
        } else if (this.parentConstraints["LayoutDirection"]) {
            // 父级约束
            if (this.parentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
                // 水平
                if (this.parentConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Start) {
                    // 顶对齐
                    return transUnit(this.pY);
                }
            } else if (this.parentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical) {
                // 垂直
                if (this.parentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Start) {
                    // 顶对齐
                    return transUnit(this.prevNode ? (this.pY - this.prevNode.pY - this.prevNode.height) : this.pY);
                } else if (this.parentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Center) {
                    // 居中
                    return this.prevNode ? transUnit(this.pY - this.prevNode.pY - this.prevNode.height) : null;
                }
            }
        }
    }
    get _marginRight() {
        // 自身约束
        if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.constraints["LayoutSelfHorizontal"]) {
            if (this.constraints["LayoutSelfHorizontal"] == Constraints.LayoutSelfHorizontal.Right) {
                // 右对齐
                return transUnit(this.nextNode ?
                    (this.nextNode.pX - this.pX - this.width) :
                    (this.parentNode.width - this.pX - this.width)
                );
            }
        } else if (this.parentConstraints["LayoutDirection"]) {
            // 父级约束
            if (this.parentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
                // 水平
                if (this.parentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.End) {
                    // 右对齐
                    return transUnit((this.nextNode ?
                        (this.nextNode.pX - this.pX - this.width) :
                        (this.parentNode.width) - this.pX - this.width)
                    );
                }
            } else if (this.parentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical) {
                // 垂直
                if (this.parentConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Center) {
                    // 居中
                    return 'auto'
                } else if (this.parentConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.End) {
                    // 右对齐
                    return transUnit(this.parentNode.width - this.pX - this.width);
                }
            }
        }

    }
    get _marginBottom() {
        if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.constraints["LayoutSelfVertical"]) {
            // 底对齐
            if (this.constraints["LayoutSelfVertical"] == Constraints.LayoutSelfVertical.Bottom) {
                return transUnit(this.parentNode.height - this.pY - this.height);
            }
        }
        // 父级约束
        if (this.parentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Verticalz) {
            // 底对齐
            if (this.parentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.End) {
                return transUnit(this.nextNode ?
                    (this.nextNode.pY - this.pY - this.height) :
                    (this.parentNode.height - this.pY - this.height)
                )
            }
        }
    }
    get backgroundImage() {
        if (this.styles.background &&
            this.styles.background.type == 'linear') {
            return calLinearGradient(this.styles.background, this._width, this._height);
        } else if (this.path) {
            return `url(${this.path})`;
        }
    }
    get backgroundSize() {
        if (this.path) {
            return '100% 100%';
        }
    }
    get filter() {
        let filter = [];
        if (this.styles.shadows && this.styles.shadows.forEach) {
            this.styles.shadows.forEach((s, i) => {
                filter.push('drop-shadow(' + [
                    transUnit(s.pX),
                    transUnit(s.pY),
                    transUnit(s.blur),
                    // transUnit(s.spread),
                    getRGBA(s.color)
                ].join(' ') + ')');
            })
        }
        return filter.join(' ');
    }
    get backgroundRepeat() {
        if (this.path) {
            return 'no-repeat';
        }
    }

    get backgroundColor() {
        if (this.styles.background &&
            this.styles.background.type == 'color') {
            return getRGBA(this.styles.background.color);
        }
    }
    get lineHeight() {
        if (this.styles.lineHeight) {
            return this.styles.lineHeight;
        }
    }
    get opacity() {
        if (typeof this.styles.opacity == 'number') {
            return this.styles.opacity;
        }
    }
    get color() {
        if (this.texts) {
            return getRGBA(this.texts[0].color);
        }
    }
    get fontFamily() {
        if (this.texts) {
            return this.texts[0].font;
        }
    }
    get display() {
        if (this.constraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
            return 'box';
        } else if (this.constraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical) {
            return 'block';
        }
    }

    get fontSize() {
        if (this.texts) {
            return transUnit(this.texts[0].size);
        }
    }
    get position() {
        if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return "absolute";
        } else if (this.constraints["LayoutPosition"] == Constraints.LayoutPosition.Absolute) {
            return "relative";
        }/*  else if (this.constraints["LayoutPosition"] == Constraints.LayoutPosition.Static) {
            return "static"
        } */
    }
    get border() {
        if (this.styles.border && this.styles.border.width) {
            return `${transUnit(this.styles.border.width)} solid ${getRGBA(this.styles.border.color)}`;
        }
    }

    get boxAlign() {
        if (this.constraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Start) {
            return "start"
        } else if (this.constraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Center) {
            return "center"
        } else if (this.constraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.End) {
            return "end"
        }
    }
    get boxOrient() {
        if (this.constraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
            return 'horizontal'
        }
    }
    get boxPack() {
        if (this.constraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Start) {
            return "start"
        } else if (this.constraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Center) {
            return "center"
        } else if (this.constraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.End) {
            return "end"
        }
    }
}



module.exports = {
    process,
    getCssString
}