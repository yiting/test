const Utils = require('./dsl_utils.js');
const Constraints = require('./dsl_Constraints.js');
const Render = require('./dsl_render.js');
const HtmlRender = require('./dsl_htmlrender.js');

const CompatibleKey = ['box-flex', 'box-orient', 'box-pack', 'box-align']
const CompatibleValue = ['box']

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
    "zIndex",
    "backgroundImage",
    "backgroundColor",
    "backgroundSize",
    "backgroundRepeat",
    "padding",
    "color",
    "fontFamily",
    "fontSize",
    "position",
    "border",
    "boxSizing",
    "borderRadius",
    "overflow",
    "textOverflow",
    "boxFlex",
    "boxOrient",
    "boxPack",
    "boxAlign",
    "display",
    "textAlign",
    "whiteSpace",
    "lineHeight",
    "opacity"
]

class CSSRender extends Render {
    constructor(node, parentNode) {
        super(node, parentNode);
        // this.SelfConstraints = node.constraints;
        this.ParentConstraints = parentNode && parentNode.constraints || {};
        this._class = node._class || '';
        this.SelfConstraints = node.constraints || {};
    }
    getClass() {
        return this._class ? `.${this._class}[ts-${this.id}]` : `[ts-${this.id}]`
    }
    getCssProperty() {
        let props = []
        cssPropertyMap.forEach(key => {
            let value = this['_' + key]
            if (CompatibleValue.includes(value)) {
                value = '-webkit-' + value;
            }
            if (value) {
                let name = Utils.nameLower(key);
                if (CompatibleKey.includes(name)) {
                    const webkitName = '-webkit-' + name
                    props.push(`${webkitName}:${value}`)
                } else {
                    props.push(`${name}:${value}`)
                }
            }
        })
        return props.join(';')

    }
    getCss() {
        return `${this.getClass()}{${this.getCssProperty()}}`
    }
    /* margin */

    get _marginLeft() {

        // 自身约束
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return;
        }
        if (this.SelfConstraints["LayoutSelfHorizontal"]) {
            // 自身约束
            if (this.SelfConstraints["LayoutSelfHorizontal"] == Constraints.LayoutSelfHorizontal.Left) {
                return CSSRender.transUnit(this.x - this.prevNode ? (this.prevNode.x + this.prevNode.width) : 0);
            }
        } else if (this.ParentConstraints["LayoutDirection"]) {
            // 父级约束
            if (this.ParentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
                // 水平
                if (this.ParentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Center) {
                    // 居中
                    return this.prevNode ? CSSRender.transUnit(this.x - this.prevNode.x - this.prevNode.width) : null;
                } else if (this.ParentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Start) {
                    // 左对齐
                    return CSSRender.transUnit(this.prevNode ? (this.x - this.prevNode.x - this.prevNode.width) : this.x);
                }
            } else if (this.ParentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical) {
                // 垂直
                if (this.ParentConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Center) {
                    // 居中
                    return 'auto'
                } else if (this.ParentConstraints["LayoutAlignItems"] != Constraints.LayoutAlignItems.Start) {
                    return CSSRender.transUnit(this.x);
                }
            }
        }

    }
    get _marginTop() {
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfConstraints["LayoutSelfVertical"]) {
            if (this.SelfConstraints["LayoutSelfVertical"] == Constraints.LayoutSelfVertical.Top) {
                // 顶对齐
                return CSSRender.transUnit(this.prevNode ?
                    (this.y - this.prevNode.y - this.parentNode.height) :
                    this.y
                );
            }
        } else if (this.ParentConstraints["LayoutDirection"]) {
            // 父级约束
            if (this.ParentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
                // 水平
                if (this.ParentConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Start) {
                    // 顶对齐
                    return CSSRender.transUnit(this.y);
                }
            } else if (this.ParentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical) {
                // 垂直
                if (this.ParentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Start) {
                    // 顶对齐
                    return CSSRender.transUnit(this.prevNode ? (this.y - this.prevNode.y - this.prevNode.height) : this.y);
                } else if (this.ParentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Center) {
                    // 居中
                    return this.prevNode ? CSSRender.transUnit(this.y - this.prevNode.y - this.prevNode.height) : null;
                }
            }
        }
    }
    get _marginRight() {
        // 自身约束
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfConstraints["LayoutSelfHorizontal"]) {
            if (this.SelfConstraints["LayoutSelfHorizontal"] == Constraints.LayoutSelfHorizontal.Right) {
                // 右对齐
                return CSSRender.transUnit(this.nextNode ?
                    (this.nextNode.x - this.x - this.width) :
                    (this.parentNode.width - this.x - this.width)
                );
            }
        } else if (this.ParentConstraints["LayoutDirection"]) {
            // 父级约束
            if (this.ParentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
                // 水平
                if (this.ParentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.End) {
                    // 右对齐
                    return CSSRender.transUnit((this.nextNode ?
                        (this.nextNode.x - this.x - this.width) :
                        (this.parentNode.width) - this.x - this.width)
                    );
                }
            } else if (this.ParentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical) {
                // 垂直
                if (this.ParentConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Center) {
                    // 居中
                    return 'auto'
                } else if (this.ParentConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.End) {
                    // 右对齐
                    return CSSRender.transUnit(this.parent.width - this.x - this.width);
                }
            }
        }

    }
    get _marginBottom() {
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfConstraints["LayoutSelfVertical"]) {
            // 底对齐
            if (this.SelfConstraints["LayoutSelfVertical"] == Constraints.LayoutSelfVertical.Bottom) {
                return CSSRender.transUnit(this.parentNode.height - this.y - this.height);
            }
        }
        // 父级约束
        if (this.ParentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Verticalz) {
            // 底对齐
            if (this.ParentConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.End) {
                return CSSRender.transUnit(this.nextNode ?
                    (this.nextNode.y - this.y - this.height) :
                    (this.parentNode.height - this.y - this.height)
                )
            }
        }
    }

    /* position */
    get _left() {
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute &&
            this.SelfConstraints["LayoutSelfHorizontal"] == Constraints.LayoutSelfHorizontal.Left) {
            return CSSRender.transUnit(this.x);
        }
    }
    get _right() {
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute &&
            this.SelfConstraints["LayoutSelfHorizontal"] == Constraints.LayoutSelfHorizontal.Right) {
            return CSSRender.transUnit(this.parentNode.width - this.x - this.width);
        }

    }
    get _top() {
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute &&
            this.SelfConstraints["LayoutSelfVertical"] == Constraints.LayoutSelfVertical.Top) {
            return CSSRender.transUnit(this.y);
        }
    }
    get _bottom() {
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute &&
            this.SelfConstraints["LayoutSelfVertical"] == Constraints.LayoutSelfVertical.Bottom) {
            return CSSRender.transUnit(this.parentNode.height - this.y - this.height);
        }
    }
    get _filter() {
        let filter = [];
        if (this.styles.shadows && this.styles.shadows.forEach) {
            this.styles.shadows.forEach((s, i) => {
                filter.push('drop-shadow(' + [
                    CSSRender.transUnit(s.x),
                    CSSRender.transUnit(s.y),
                    CSSRender.transUnit(s.blur),
                    // CSSRender.transUnit(s.spread),
                    CSSRender.getRGBA(s.color)
                ].join(' ') + ')');
            })
        }
        return filter.join(' ');
    }
    get _width() {
        // 固定宽度
        if (this.SelfConstraints["LayoutFixedWidth"] == Constraints.LayoutFixedWidth.Fixed) {
            return CSSRender.transUnit(this.width)
        } else {
            return 'auto'
        }

    }
    get _height() {
        // 固定高度
        if (this.SelfConstraints["LayoutFixedHeight"] == Constraints.LayoutFixedHeight.Fixed) {
            return CSSRender.transUnit(this.height);
        } else {
            return 'auto';
        }

    }

    get _zIndex() {
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return this.zIndex;
        }
    }
    /* background */
    get _backgroundImage() {
        if (this.styles.background &&
            this.styles.background.type == 'linear') {
            return CSSRender.getLinearGradient(this.styles.background, this.width, this.height);
        } else if (this.path) {
            return `url(${this.path})`;
        }
    }
    get _backgroundColor() {
        if (this.styles.background &&
            this.styles.background.type == 'color') {
            return CSSRender.getRGBA(this.styles.background.color);
        }
    }
    get _backgroundSize() {
        if (this.path) {
            return 'contain';
        }
    }
    get _backgroundRepeat() {
        if (this.path) {
            return 'no-repeat';
        }
    }
    get _padding() {
        if (this.styles.padding) {
            return '0 ' + CSSRender.transUnit(this.styles.padding);
        }
    }
    /* font */
    get _color() {
        if (this.texts) {
            return CSSRender.getRGBA(this.texts[0].color);
        }
    }
    get _fontFamily() {
        if (this.texts) {
            return this.texts[0].font;
        }
    }
    get _fontSize() {
        if (this.texts) {
            return CSSRender.transUnit(this.texts[0].size);
        }
    }
    get _position() {
        if (this.SelfConstraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
            return "absolute";
        } else if (this.SelfConstraints["LayoutPosition"] == Constraints.LayoutPosition.Absolute) {
            return "relative";
        }/*  else if (this.SelfConstraints["LayoutPosition"] == Constraints.LayoutPosition.Static) {
            return "static"
        } */
    }
    get _border() {
        if (this.styles.border && this.styles.border.width) {
            let borderType = CSSRender.getBorderType(this.styles.border.type),
                borderWidth = CSSRender.transUnit(this.styles.border.width),
                borderColor = CSSRender.getRGBA(this.styles.border.color);
            return [borderWidth, borderType, borderColor].join(' ');
        }
    }
    get _boxSizing() {
        if (this.styles.border && this.styles.border.width ||
            this.styles.padding) {
            return "border-box";
        }
    }
    get _borderRadius() {
        if (this.styles.borderRadius) {
            return CSSRender.getRadius(this.styles.borderRadius, Math.min(this.height, this.width));
        }
    }
    get _overflow() {
        /* hidden 规则
           1. 文字限制 
           2. 垂直布局
        */
        if (this.styles.borderRadius ||
            this.isEllipsis() ||
            this.SelfConstraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical
        ) {
            return 'hidden';
        }
        if (this.SelfConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal &&
            Utils.getRangeByNodes(this.children).width > this.width
        ) {
            // 水平滚动
            return "auto";
        }
    }
    get _textOverflow() {
        if (this.isEllipsis()) {
            return 'ellipsis';
        }
    }
    get _boxFlex() {
        if (this.ParentConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal &&
            this.SelfConstraints["LayoutFlex"] == Constraints.LayoutFlex.Auto) {
            return 1;
        }
    }
    get _boxOrient() {
        if (this.SelfConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
            return 'horizontal'
        }
    }
    get _boxPack() {
        if (this.SelfConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Start) {
            return "start"
        } else if (this.SelfConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.Center) {
            return "center"
        } else if (this.SelfConstraints["LayoutJustifyContent"] == Constraints.LayoutJustifyContent.End) {
            return "end"
        }
    }
    get _boxAlign() {
        if (this.SelfConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Start) {
            return "start"
        } else if (this.SelfConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.Center) {
            return "center"
        } else if (this.SelfConstraints["LayoutAlignItems"] == Constraints.LayoutAlignItems.End) {
            return "end"
        }
    }
    get _display() {
        if (this.SelfConstraints["LayoutDirection"] == Constraints.LayoutDirection.Horizontal) {
            return 'box';
        } else if (this.SelfConstraints["LayoutDirection"] == Constraints.LayoutDirection.Vertical) {
            return 'block';
        }
    }
    get _textAlign() {
        if (!this.texts) {
            return;
        }
        if (this.SelfConstraints["LayoutSelfHorizontal"]) {
            return CSSRender.getAlign(this.SelfConstraints["LayoutSelfHorizontal"].toLowerCase());
        } else if (this.SelfConstraints["LayoutJustifyContent"]) {
            return CSSRender.getAlign(this.SelfConstraints["LayoutJustifyContent"].toLowerCase());
        } else if (this.styles.textAlign) {
            return CSSRender.getAlign(this.styles.textAlign);
        }
    }
    get _whiteSpace() {
        if (this.lines == 1) {
            return "nowrap";
        }
    }
    get _lineHeight() {
        if (this.styles.lineHeight) {
            return this.styles.lineHeight / this.styles.maxSize;
        }
    }
    get _opacity() {
        if (typeof this.styles.opacity == 'number') {
            return this.styles.opacity;
        }
    }
    /*  
        判断是否需要省略号
    */
    isEllipsis() {
        // return this.model == Store.model.TEXT && this.SelfConstraints["LayoutFlex"] == Constraints.LayoutFlex.Auto
        return this.texts && !!this.findParentUntil(function (d) {
            return d && d.constraints && d.constraints["LayoutFlex"] == Constraints.LayoutFlex.Auto;
        })
    }
    /**
     * 
     * @param {Array} vals 圆角数组
     * @param {Number} maxSize 圆角最大值
     */
    static getRadius(vals, maxSize = 100) {
        if (!(vals instanceof Array)) {
            vals = [vals];
        }
        return vals.map(v => {
            v = v < maxSize / 2 ? v : maxSize / 2;
            return CSSRender.transUnit(v);
        }).join(' ');
    }
    /**
     * 转换sketch中border类型
     * @param  {Number} dash sketch边框宽度
     * @return {String}      border-type
     */
    static getBorderType(style) {
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
     * 获取线性渐变值
     * @param {Color} bgColor 背景色
     * @param {Number} width 宽度
     * @param {Number} height 高度
     */
    static getLinearGradient(bgColor, width, height) {
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
                color: CSSRender.getRGBA(stop.color),
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
    /**
     * 转换sketch颜色为rgba
     * @param  {String} color sketch颜色，如#00000000;
     * @return {String}       rgba(0,0,0,0)
     */
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
    static getAlign(type) {
        return {
            "0": "left",
            "1": "right",
            "2": "center",
            "start": "left",
            "end": "right"
        }[type]

    }
    static getString(dom, parentNode) {
        let css = '';
        let render = new CSSRender(dom, parentNode);
        // 遍历循环
        css += render.getCss();
        render.children.forEach && render.children.forEach(child => {
            css += CSSRender.getString(child, render)
        });
        return css;
    }
}

// 渲染器样式缓存
CSSRender._cssCache = [];

module.exports = CSSRender;