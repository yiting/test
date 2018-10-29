const CONTRAIN = require('./dsl_contrain.js');
const Common = require('./dsl_common.js');
const Store = require("./dsl_store.js");
const Dom = require("./dsl_dom.js");
// domtree
const DOM_NULL = '<null>';
const CLOSING_TAGS = ['img', 'input', 'br'];


class Render {
    constructor(o, parentNode) {
        this.styleObj = {}
        this.attrObj = {}
        this.inlineStyle = {};
        this.className = [];
        this.children = [];
        this.tagName = '';
        this.data = o;
        this.parentNode = parentNode;
        this.SelfContrain = this.data.contrains;
        this.ParentContrains = parentNode && parentNode.data.contrains || {};
    }
    /* 节点样式 */
    get css() {
        // 第一期，返回当前节点所有样式
        let str = `.${this.className}{`
        let style = this.styleObj;
        for (var i in style) {
            str += i + ':' + style[i] + ';\n'
        }
        if (this.filter) {
            str += 'filter:' + this.filter;
        }
        str += '}';
        return str;
        // 第二期，根据类，返回样式
    }
    /* 节点html */
    get html() {
        let attr = this.attrObj,
            style = this.inlineStyle || '',
            className = this.className
        let attrArr = [];
        let styleArr = Object.keys(style).map((key, i) => {
            return `${key}:${style[key]}`;
        });
        // 样式名
        if (className.length) {
            attrArr.push('class="' + className.join(' ') + '"');
        }
        // 行内属性
        Object.keys(attr).forEach((key, i) => {
            attrArr.push(`${key}="${attr[key]}"`);
        });
        // 行内样式
        if (styleArr.length) {
            attrArr.push('style="' + styleArr.join(';') + '"')
        }
        let attrStr = attrArr.join(' ');
        // 结束标签
        if (this.isClosingTag) {
            return {
                start: `<${this.tagName} ${attrStr}/>`,
                end: ''
            }
        } else {
            return {
                start: `<${this.tagName} ${attrStr}>${this.innerText}`,
                end: `</${this.tagName}>`
            }
        }
    }
    get filter() {
        let filter = [];
        if (this.data.styles && this.data.styles.shadows) {
            this.data.styles.shadows.forEach((s, i) => {
                filter.push('drop-shadow(' + [
                    Render.unit(s.x),
                    Render.unit(s.y),
                    Render.unit(s.blur),
                    // Render.unit(s.spread),
                    Render.toRGBA(s.color)
                ].join(' ') + ')');
            })
        }
        return filter.join(' ');
    }
    get isClosingTag() {
        return CLOSING_TAGS.includes(this.tagName);
    }

    get prevData() {
        return this.parentNode && this.parentNode.data.children[this.parentNode.data.children.indexOf(this.data) - 1];
    }
    get nextData() {
        return this.parentNode && this.parentNode.data.children[this.parentNode.data.children.indexOf(this.data) + 1];
    }
    /**
     * style
     */
    get width() {
        // 固定宽度
        if (this.SelfContrain["LayoutFixedWidth"] == CONTRAIN.LayoutFixedWidth.Fixed) {
            return Render.unit(this.data.width)
        } else {
            return 'auto'
        }

    }
    get height() {
        // 固定高度
        if (this.SelfContrain["LayoutFixedHeight"] == CONTRAIN.LayoutFixedHeight.Fixed) {
            return Render.unit(this.data.height);
        } else {
            return 'auto';
        }

    }
    get marginLeft() {

        // 自身约束
        if (this.SelfContrain["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfContrain["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Left) {
            let margin = Dom.calMargin(this.data, this.parentNode.data);
            return Render.unit(margin["left"]);
        } else if (this.SelfContrain["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Right) {
            return;
        }
        // 父级约束
        if (this.ParentContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Horizontal) {
            // 水平
            if (this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Center) {
                return this.prevData ? Render.unit(this.data.x - this.prevData.x - this.prevData.width) : null;
            } else if (this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Start) {
                return Render.unit(this.data.x - (this.prevData ? (this.prevData.x + this.prevData.width) : 0));
            }
        } else if (this.ParentContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Vertical &&
            this.ParentContrains["LayoutAlignItems"] != CONTRAIN.LayoutAlignItems.Start &&
            this.ParentContrains["LayoutAlignItems"] != CONTRAIN.LayoutAlignItems.Center &&
            this.ParentContrains["LayoutAlignItems"] != CONTRAIN.LayoutAlignItems.End) {
            return Render.unit(this.data.x);
        }

    }
    get marginTop() {

        if (this.SelfContrain["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfContrain["LayoutSelfVertical"] == CONTRAIN.LayoutSelfVertical.Top) {
            let margin = Dom.calMargin(this.data, this.parentNode.data);
            return Render.unit(margin["top"]);
        }
        // 父级约束
        if (this.ParentContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Horizontal &&
            this.ParentContrains["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.Start) {
            return Render.unit(this.data.y);
        } else if (this.ParentContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Vertical) {
            // 垂直
            if (this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Start) {
                return Render.unit(this.data.y - (this.prevData ? (this.prevData.y + this.prevData.height) : 0));
            } else if (this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Center) {
                return this.prevData ? Render.unit(this.data.y - this.prevData.y - this.prevData.height) : null;
            }
        }
        return;
    }
    get marginRight() {
        // 自身约束
        if (this.SelfContrain["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfContrain["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Right) {
            let margin = Dom.calMargin(this.data, this.parentNode.data);
            return Render.unit(margin["right"]);
        }
        if (this.ParentContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Horizontal &&
            this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.End) {
            return Render.unit((this.nextData ? this.nextData.x : this.parentNode.data.width) - this.data.x - this.data.width);
        } else if (this.ParentContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Vertical &&
            this.ParentContrains["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.End) {
            return Render.unit(parent.width - this.data.x - this.data.width);
        }

    }
    get marginBottom() {

        if (this.SelfContrain["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfContrain["LayoutSelfVertical"] == CONTRAIN.LayoutSelfVertical.Bottom) {
            let margin = Dom.calMargin(this.data, this.parentNode.data);
            return Render.unit(margin["bottom"]);
        }
        // 父级约束
        if (this.ParentContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Vertical &&
            this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.End) {
            return Render.unit((this.nextData ? this.nextData.y : this.parentNode.data.height) - this.data.y - this.data.height);
        }
    }
    get color() {
        return Render.toRGBA(this.data.color)
    }
    get backgroundColor() {
        if (this.data.styles && this.data.styles.background &&
            this.data.styles.background.type == 'color') {
            return Render.toRGBA(this.data.styles.background.color);
        }
    }
    get backgroundSize() {
        if (this.data.type == Dom.type.IMAGE &&
            this.data.model != Store.model.IMAGE.name
        ) {
            return 'contain';
        }
    }
    get backgroundRepeat() {
        if (this.data.type == Dom.type.IMAGE &&
            this.data.model != Store.model.IMAGE.name
        ) {
            return 'no-repeat';
        }
    }
    get padding() {
        if (this.data.styles.padding) {
            return '0 ' + Render.unit(this.data.styles.padding);
        }
    }
    get backgroundImage() {
        if (this.data.type == Dom.type.IMAGE &&
            this.data.model != Store.model.IMAGE.name&&
            this.data.model != Store.model.POSTER.name
        ) {
            return `url(${this.data.path})`;
        }
        if (this.data.styles && this.data.styles.background &&
            this.data.styles.background.type == 'linear') {
            return Render.calLinearGradient(this.data.styles.background, this.data.width, this.data.height);
        }
    }
    get left() {
        const Pos = Dom.calPosition(this.data, this.parentNode && this.parentNode.data);

        if ((this.SelfContrain["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute ||
                Object.keys(this.ParentContrains).length == 0) &&
            this.SelfContrain["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Left) {
            return Render.unit(Pos.left);
        }
    }
    get right() {
        const Pos = Dom.calPosition(this.data, this.parentNode && this.parentNode.data);

        if ((this.SelfContrain["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute ||
                Object.keys(this.ParentContrains).length == 0) &&
            this.SelfContrain["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Right) {
            return Render.unit(Pos.right);
        }

    }
    get top() {
        const Pos = Dom.calPosition(this.data, this.parentNode && this.parentNode.data);

        if ((this.SelfContrain["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute ||
                Object.keys(this.ParentContrains).length == 0) &&
            this.SelfContrain["LayoutSelfVertical"] == CONTRAIN.LayoutSelfVertical.Top) {
            return Render.unit(Pos.top);
        }
    }
    get bottom() {
        const Pos = Dom.calPosition(this.data, this.parentNode && this.parentNode.data);
        if ((this.SelfContrain["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute ||
                Object.keys(this.ParentContrains).length == 0) &&
            this.SelfContrain["LayoutSelfVertical"] == CONTRAIN.LayoutSelfVertical.Bottom) {
            return Render.unit(Pos.bottom);
        }
    }
    get fontFamily() {
        return this.data.font;
    }
    get fontSize() {
        if (this.data.size) {
            return Render.unit(this.data.size);
        }
    }
    get position() {
        if (this.SelfContrain["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return "absolute";
        }
        if (this.SelfContrain["LayoutPosition"] == CONTRAIN.LayoutPosition.Absolute) {
            return "relative";
        }
    }
    get border() {
        if (this.data.styles && this.data.styles.border && this.data.styles.border.width) {
            // let type = this.data.border["position"] == "outside" ? "outline" : "border",
            let borderType = Render.borderType(this.data.styles.border.type),
                borderWidth = Render.unit(this.data.styles.border.width),
                borderColor = Render.toRGBA(this.data.styles.border.color);
            return [borderWidth, borderType, borderColor].join(' ');
        }
    }
    get boxSizing() {
        if (this.data.styles && this.data.styles.border && this.data.styles.border.width) {
            return "border-box";
        }
    }
    get borderRadius() {
        if (this.data.styles && this.data.styles.borderRadius) {
            return Render.unit(this.data.styles.borderRadius);
        }
    }
    get shadow() {

        if (this.data.styles && this.data.styles.shadows) {
            let shadows = []
            this.data.styles.shadows.forEach((s, i) => {
                shadows.push('drop-shadow(' + [
                    Render.unit(s.x),
                    Render.unit(s.y),
                    Render.unit(s.blur),
                    // Render.unit(s.spread),
                    Render.toRGBA(s.color)
                ].join(' ') + ')');
            });
            return shadows;
        }
    }
    /* get flex() {
        if (this.SelfContrain["LayoutFlex"] == CONTRAIN.LayoutFlex.Auto) {
            return 'auto';
        } else if (this.SelfContrain["LayoutFlex"] == CONTRAIN.LayoutFlex.None) {
            return 'none';
        } else {
            return 'unset';
        }
    } */
    /*  get flexDirection() {
         if (this.SelfContrain["LayoutPosition"] == CONTRAIN.LayoutPosition.Horizontal) {
             return 'row';
         }
     } */
    /* get justifyContent() {

        if (this.SelfContrain["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Between) {
            return 'space-between';
        } else if (this.SelfContrain["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Center) {
            return 'center';
        } else if (this.SelfContrain["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.End) {
            return 'end';
        } else if (this.SelfContrain["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Start) {
            return 'start';
        }
    } */
    /* get alignItems() {

        // 纵轴
        if (this.SelfContrain["LayoutAlignItems"] == CONTRAIN.LayoutJustifyContent.Start) {
            return 'flex-start';
        } else if (this.SelfContrain["LayoutAlignItems"] == CONTRAIN.LayoutJustifyContent.End) {
            return 'flex-end';
        } else if (this.SelfContrain["LayoutAlignItems"] == CONTRAIN.LayoutJustifyContent.Center) {
            return 'center';
        }
    } */
    get overflow() {
        /* hidden 规则
           1. 文字限制 
           2. 垂直布局
        */
        if (this.isEllipsis() ||
            this.SelfContrain["LayoutPosition"] == CONTRAIN.LayoutPosition.Vertical
        ) {
            return 'hidden';
        } else {
            return 'visible'
        }
    }
    get textOverflow() {
        if (this.isEllipsis()) {
            return 'ellipsis';
        } else {
            return 'clip';
        }
    }
    get boxFlex() {
        if (this.SelfContrain["LayoutFlex"] == CONTRAIN.LayoutFlex.Auto) {
            return 1;
            // } else if (this.SelfContrain["LayoutFlex"] == CONTRAIN.LayoutFlex.Default) {
        } else {
            return 0;
        }
    }
    get boxOrient() {
        if (this.SelfContrain["LayoutPosition"] == CONTRAIN.LayoutPosition.Horizontal) {
            return 'horizontal'
        }
    }
    get boxPack() {
        if (this.SelfContrain["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Start) {
            return "start"
        } else if (this.SelfContrain["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Center) {
            return "center"
        } else if (this.SelfContrain["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.End) {
            return "end"
        }
    }
    get boxAlign() {
        if (this.SelfContrain["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.Start) {
            return "start"
        } else if (this.SelfContrain["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.Center) {
            return "center"
        } else if (this.SelfContrain["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.End) {
            return "end"
        }
    }
    get display() {

        if (this.SelfContrain["LayoutPosition"] == CONTRAIN.LayoutPosition.Horizontal) {
            // return 'flex';
            return 'box';
        } else if (this.SelfContrain["LayoutPosition"] == CONTRAIN.LayoutPosition.Vertical) {
            return 'block';
        }
    }
    get textAlign() {
        if (this.SelfContrain["LayoutAlign"]) {
            // 对齐约束值 比 对齐配置值 大1
            return Render.align(this.SelfContrain["LayoutAlign"] - 1);
        } else if (this.data.styles && this.data.styles.textAlign) {
            return Render.align(this.data.styles.textAlign);
        }
    }
    get whiteSpace() {
        if (this.data.lines == 1) {
            return "nowrap";
        }
    }
    get lineHeight() {
        if (this.data.styles && this.data.styles.lineHeight) {
            return Render.unit(this.data.styles.lineHeight);
        }
    }
    get opacity() {
        if (this.data.styles && this.data.styles.opacity) {
            return this.data.styles.opacity;
        }
    }
    /**
     * dom输出html
     * @param  {Render} dom   dom节点
     * @param  {Number} level 层级
     * @return {HTML}       HTML
     */
    _toHtml(dom, level = 0) {
        let str = dom.html.start;
        dom.children.forEach((d, i) => {
            str += this._toHtml(d, level + 1 || 1);
        });
        if (!dom.isClosingTag) {
            str += dom.html.end;
        }
        return str;
    }

    toHtml(cb) {
        let rt = this._toHtml(this)
        typeof cb == 'function' && cb(rt);
        return rt;
    }
    /**
     * 输出Css
     * @param  {Render} dom dom节点
     * @return {Css}     Css
     */
    _toCss(dom) {
        let str = dom.css;
        dom.children.forEach((d, i) => {
            str += this._toCss(d);
        });
        return str;
    }

    toCss(cb) {
        let base = 'html{font-size:13.33333vw;}body{font-size:0;margin:0;}img{font-size:0;display:block;}ul,li{list-style:none;margin:0;padding:0;}';
        let rt = this._toCss(this)
        typeof cb == 'function' && cb(rt);
        return base + rt;
    }
    /*  
        判断是否需要省略号
    */
    isEllipsis() {
        return this.data.model == Store.model.TEXT.name && this.SelfContrain["LayoutFlex"] == CONTRAIN.LayoutFlex.Auto
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

    /**
     * 单位换算补充
     * @param  {Number} number 数值
     * @param  {String} unit   单位类型，默认px
     * @return {String}        数值+单位
     */
    static unit(number, unit = Config.dsl.unit) {
        number = parseInt(number) || 0;
        // 1像素特殊处理
        if (number == 1) {
            return '1px';
        }
        if (unit == 'rem') {
            return number / 100 + 'rem';
        } else {
            return number + 'px';
        }
    }
    static fontWeight(weight) {
        return Dom.fontWeight[weight]

    }

    static calLinearGradient(bgColor, width, height) {
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
                color: Render.toRGBA(stop.color),
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
        return `-webkit-linear-gradient(${angle}deg, ${stops.map((s)=>{
                        return s.color + ' ' + (s.offset * 100) + '%';
                    }).join(',')})`;
    }
    /**
     * 转换sketch颜色为rgba
     * @param  {String} color sketch颜色，如#00000000;
     * @return {String}       rgba(0,0,0,0)
     */
    static toRGBA(color) {
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
    static align(index) {
        return Object.keys(Dom.align).find(k => Dom.align[k] == index);
    }
}

let domIndex = 0;

function getTextStyleObj(data) {
    let styleObj = {}
    styleObj["font-size"] = Render.unit(data.size);
    styleObj["font-family"] = data.font;
    styleObj["white-space"] = "pre-line";
    styleObj['color'] = Render.toRGBA(data.color);
    return styleObj
}
class Text extends Render {
    constructor(o, parentNode) {
        super(o, parentNode);
        this.index = domIndex++;
        this.tagName = 'span';
        this.inlineStyle = getTextStyleObj(o);
        return this;
    }
    get innerText() {
        return this.data.string;
    }

    // 返回Dom相关样式对象
}
class DOM extends Render {
    constructor(o, parentNode) {
        super(o, parentNode);
        let _render = this;
        this.index = domIndex++;
        if (parentNode) {
            parentNode.children.push(this);
        }

        if (this.data.text && this.data.styles.texts.length > 1) {
            this.data.styles.texts.forEach((t) => {
                _render.children.push(new Text(t));
            });
            this.data.text = '';
        } else if (this.data.text) {
            Object.assign(this.styleObj, getTextStyleObj(this.data.styles.texts[0]))
        }
        this.getClassName();
        this.getTagName();
        this.getStyleObj();
        this.getAttrObj();
        this.getInlineStyle();
        return this;
    }
    get innerText() {
        return this.data.text || '';
    }
    getClassName() {
        // console.log(this.data.model)
        this.className.push((this.data.model).toLowerCase() + '-' + this.index);
        // this.className.push('sk' + this.data.id);
        // 第二期，根据dom结构输出class
    }
    getAttrObj() {
        if (this.data.model == Store.model.IMAGE.name) {
            this.attrObj["src"] = this.data.path;
        }
        // if (Config.debug) {
        //this.attrObj["data-id"] = this.data.id;
        // }
    }
    getInlineStyle() {
        if (this.data.model == Store.model.POSTER.name) {
            this.inlineStyle["background-image"] = `url(${this.data.path})`;
        };

    }
    getTagName() {
        this.tagName = "div";
        if (this.data.model == Store.model.TEXT.name) {
            this.tagName = 'div';
        } else if (this.data.model == Store.model.IMAGE.name) {
            this.tagName = "img";
        }
        return this.tagName
    }
    // 返回Dom相关样式对象
    getStyleObj() {
        let render = this,
            val;
        [
            "overflow",
            "width",
            "height",
            "marginLeft",
            "marginTop",
            "marginRight",
            "marginBottom",
            "padding",
            "color",
            "backgroundColor",
            "backgroundImage",
            "backgroundSize",
            "backgroundRepeat",
            "left",
            "right",
            "top",
            "bottom",
            "fontFamily",
            "fontSize",
            "position",
            "border",
            "boxSizing",
            "borderRadius",
            "shadow",
            // "flex",
            // "flexBasis",
            // "flexDirection",
            // "flexGrow",
            // "flexShrink",
            // "justifyContent",
            // "alignItems",
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
        ].forEach(key => {
            let value = render[key]
            if (value == undefined) {
                return;
            }
            let name = nameTrans(key);
            if (CompatibleKey.includes(name)) {
                render.styleObj['-webkit-' + name] = value;
            } else {
                render.styleObj[name] = value;
            }
            if (CompatibleValue.includes(value)) {
                render.styleObj[name] = '-webkit-' + value;
            }
        });
    }
}

function nameTrans(str) {
    return str.replace(/([A-Z])/mg, '-$1').toLowerCase();
}
/**
 * Sketch树转为dom树
 * @param  {JSON} json Sketch树
 * @return {JSON}      dom树
 */

const CompatibleKey = ['box-flex', 'box-orient', 'box-pack', 'box-align']
const CompatibleValue = ['box']

var Config = {};

function fn(json, parentNode) {
    var dom = new DOM(json, parentNode);
    if (json.children) {
        json.children.forEach(function (j, i) {
            fn(j, dom);
        });
    }
    return dom;
}

function render(data, conf) {
    Config = conf;
    return fn(data);
}

module.exports = render