const CONTRAIN = require('./dsl_contrain.js');
const Common = require('./dsl_common.js');
const Store = require("./dsl_store.js");
const Dom = require("./dsl_dom.js");
const StyleDom = require("./dsl_styledom.js");
// domtree
const CLOSING_TAGS = ['img', 'input', 'br'];
let cssStyle_cache = [];


class Render {
    constructor(o, parentNode) {
        this.index = domIndex++;
        this.positionStyleObj = {};
        this.cssStyleObj = {};
        this.attrObj = {}
        this.inlineStyle = {};
        this.className = [];
        this.children = [];
        this.tagName = '';
        this.data = o;
        this.parentNode = parentNode;
        this.prevData = Dom.findPrevDom(this.data, parentNode && parentNode.data);
        this.nextData = Dom.findNextDom(this.data, parentNode && parentNode.data);
        this.SelfContrains = this.data.contrains;
        this.ParentContrains = parentNode && parentNode.data.contrains || {};
    }
    /* 节点样式 */
    get cssStyle() {
        // 第一期，返回当前节点所有样式
        let str = `.${this.cssClassName}{`
        let style = this.cssStyleObj;
        for (var i in style) {
            str += i + ':' + style[i] + ';\n'
        }
        str += '}';
        return str;
    }
    get positionStyle() {
        // 第一期，返回当前节点所有样式
        let str = `.${this.positionClassName}{`
        let style = this.positionStyleObj;
        for (var i in style) {
            str += i + ':' + style[i] + ';\n'
        }
        str += '}';
        return str;
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
            if (!attr[key]) {
                return
            } else if (attr[key] === true) {
                attrArr.push(key);
            } else {
                attrArr.push(`${key}="${attr[key]}"`);
            }
        });
        // 行内样式
        if (styleArr.length) {
            attrArr.push('style="' + styleArr.join(';') + '"')
        }
        let attrStr = attrArr.join(' ');
        // 结束标签
        if (CLOSING_TAGS.includes(this.tagName)) {
            return {
                start: `<${this.tagName} ${attrStr}\/>`,
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

    // get prevData() {
    // return this.parentNode && this.parentNode.data.children[this.parentNode.data.children.indexOf(this.data) - 1];
    // }
    // get nextData() {
    // return this.parentNode && this.parentNode.data.children[this.parentNode.data.children.indexOf(this.data) + 1];
    // }
    get innerText() {
        if (this.data.texts) {
            return this.data.texts[0].string;
        }
    }
    /**
     * style
     */
    get width() {
        // 固定宽度
        if (this.SelfContrains["LayoutFixedWidth"] == CONTRAIN.LayoutFixedWidth.Fixed) {
            return Render.unit(this.data.width)
        } else {
            return 'auto'
        }

    }
    get height() {
        // 固定高度
        if (this.SelfContrains["LayoutFixedHeight"] == CONTRAIN.LayoutFixedHeight.Fixed) {
            return Render.unit(this.data.height);
        } else {
            return 'auto';
        }

    }
    get zIndex() {
        if (this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return this.data.zIndex;
        }
    }
    get marginLeft() {
        // 自身约束
        if (this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfContrains["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Left) {
            let margin = Dom.calMargin(this.data, this.parentNode.data);
            return Render.unit(margin["left"]);
        } else if (this.SelfContrains["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Right) {
            return;
        }
        // 父级约束
        if (this.ParentContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Horizontal) {
            // 水平
            if (this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Center) {
                return this.prevData ? Render.unit(this.data.x - this.prevData.x - this.prevData.width) : null;
            } else if (this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Start) {
                return Render.unit(this.data.x - (this.prevData ? (this.prevData.x + this.prevData.width) : 0));
            }
        } else if (this.ParentContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Vertical) {
            /* this.ParentContrains["LayoutAlignItems"] != CONTRAIN.LayoutAlignItems.Start &&
            this.ParentContrains["LayoutAlignItems"] != CONTRAIN.LayoutAlignItems.Center &&
            this.ParentContrains["LayoutAlignItems"] != CONTRAIN.LayoutAlignItems.End) {
            return Render.unit(this.data.x); */
            if (this.ParentContrains["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.Center) {
                return 'auto'
            } else if (this.ParentContrains["LayoutAlignItems"] != CONTRAIN.LayoutAlignItems.End) {
                return Render.unit(this.data.x);
            }
        }

    }
    get marginTop() {
        if (this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfContrains["LayoutSelfVertical"] == CONTRAIN.LayoutSelfVertical.Top) {
            let margin = Dom.calMargin(this.data, this.parentNode.data);
            return Render.unit(margin["top"]);
        }
        // 父级约束
        if (this.ParentContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Horizontal &&
            this.ParentContrains["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.Start) {
            return Render.unit(this.data.y);
        } else if (this.ParentContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Vertical) {
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
        if (this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfContrains["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Right) {
            let margin = Dom.calMargin(this.data, this.parentNode.data);
            return Render.unit(margin["right"]);
        }
        if (this.ParentContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Horizontal &&
            this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.End) {
            return Render.unit((this.nextData ? this.nextData.x : this.parentNode.data.width) - this.data.x - this.data.width);
        } else if (this.ParentContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Vertical) {
            if (this.ParentContrains["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.Center) {
                return 'auto'
            } else if (this.ParentContrains["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.End) {
                return Render.unit(parent.width - this.data.x - this.data.width);
            }
        }

    }
    get marginBottom() {

        if (this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return;
        }
        // 自身约束
        if (this.SelfContrains["LayoutSelfVertical"] == CONTRAIN.LayoutSelfVertical.Bottom) {
            let margin = Dom.calMargin(this.data, this.parentNode.data);
            return Render.unit(margin["bottom"]);
        }
        // 父级约束
        if (this.ParentContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Vertical &&
            this.ParentContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.End) {
            return Render.unit((this.nextData ? this.nextData.y : this.parentNode.data.height) - this.data.y - this.data.height);
        }
    }
    get backgroundColor() {
        if (this.data.styles && this.data.styles.background &&
            this.data.styles.background.type == 'color') {
            return Render.toRGBA(this.data.styles.background.color);
        }
    }
    get backgroundSize() {
        if (this.data.type == Dom.type.IMAGE &&
            this.data.model != Store.model.IMAGE
        ) {
            return 'contain';
        }
    }
    get backgroundRepeat() {
        if (this.data.type == Dom.type.IMAGE &&
            this.data.model != Store.model.IMAGE
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
        if (this.data.styles.background &&
            this.data.styles.background.type == 'linear') {
            return Render.calLinearGradient(this.data.styles.background, this.data.width, this.data.height);
        }
        if (this.data.path &&
            this.data.children
        ) {
            return `url(${this.data.path})`;
        }
    }
    get left() {
        const Pos = Dom.calPosition(this.data, this.parentNode && this.parentNode.data);

        if ((this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute ||
                Object.keys(this.ParentContrains).length == 0) &&
            this.SelfContrains["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Left) {
            return Render.unit(Pos.left);
        }
    }
    get right() {
        const Pos = Dom.calPosition(this.data, this.parentNode && this.parentNode.data);

        if ((this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute ||
                Object.keys(this.ParentContrains).length == 0) &&
            this.SelfContrains["LayoutSelfHorizontal"] == CONTRAIN.LayoutSelfHorizontal.Right) {
            return Render.unit(Pos.right);
        }

    }
    get top() {
        const Pos = Dom.calPosition(this.data, this.parentNode && this.parentNode.data);

        if ((this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute ||
                Object.keys(this.ParentContrains).length == 0) &&
            this.SelfContrains["LayoutSelfVertical"] == CONTRAIN.LayoutSelfVertical.Top) {
            return Render.unit(Pos.top);
        }
    }
    get bottom() {
        const Pos = Dom.calPosition(this.data, this.parentNode && this.parentNode.data);
        if ((this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute ||
                Object.keys(this.ParentContrains).length == 0) &&
            this.SelfContrains["LayoutSelfVertical"] == CONTRAIN.LayoutSelfVertical.Bottom) {
            return Render.unit(Pos.bottom);
        }
    }
    get verticalAlign() {
        if (this.data.string) {
            return "middle";
        }
    }
    get color() {
        if (this.data.texts) {
            return Render.toRGBA(this.data.texts[0].color);
        }
    }
    get fontFamily() {
        if (this.data.texts) {
            return this.data.texts[0].font;
        }
    }
    get fontSize() {
        if (this.data.texts) {
            return Render.unit(this.data.texts[0].size);
        }
    }
    get position() {
        if (this.SelfContrains["LayoutSelfPosition"] == CONTRAIN.LayoutSelfPosition.Absolute) {
            return "absolute";
        }
        if (this.SelfContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Absolute) {
            return "relative";
        } else if (this.SelfContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Static) {
            return "static"
        }
    }
    get border() {
        if (this.data.styles.border && this.data.styles.border.width) {
            // let type = this.data.border["position"] == "outside" ? "outline" : "border",
            let borderType = Render.borderType(this.data.styles.border.type),
                borderWidth = Render.unit(this.data.styles.border.width),
                borderColor = Render.toRGBA(this.data.styles.border.color);
            return [borderWidth, borderType, borderColor].join(' ');
        }
    }
    get boxSizing() {
        if (this.data.styles.border && this.data.styles.border.width ||
            this.data.styles.padding) {
            return "border-box";
        }
    }
    get borderRadius() {
        if (this.data.styles.borderRadius) {
            return Render.toRadius(this.data.styles.borderRadius, Math.min(this.data.height, this.data.width));
        }
    }
    /* get shadow() {

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
    } */
    /* get flex() {
        if (this.SelfContrains["LayoutFlex"] == CONTRAIN.LayoutFlex.Auto) {
            return 'auto';
        } else if (this.SelfContrains["LayoutFlex"] == CONTRAIN.LayoutFlex.None) {
            return 'none';
        } else {
            return 'unset';
        }
    } */
    /*  get flexDirection() {
         if (this.SelfContrains["LayoutPosition"] == CONTRAIN.LayoutPosition.Horizontal) {
             return 'row';
         }
     } */
    /* get justifyContent() {

        if (this.SelfContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Between) {
            return 'space-between';
        } else if (this.SelfContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Center) {
            return 'center';
        } else if (this.SelfContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.End) {
            return 'end';
        } else if (this.SelfContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Start) {
            return 'start';
        }
    } */
    /* get alignItems() {

        // 纵轴
        if (this.SelfContrains["LayoutAlignItems"] == CONTRAIN.LayoutJustifyContent.Start) {
            return 'flex-start';
        } else if (this.SelfContrains["LayoutAlignItems"] == CONTRAIN.LayoutJustifyContent.End) {
            return 'flex-end';
        } else if (this.SelfContrains["LayoutAlignItems"] == CONTRAIN.LayoutJustifyContent.Center) {
            return 'center';
        }
    } */
    get overflow() {
        /* hidden 规则
           1. 文字限制 
           2. 垂直布局
        */
        if (this.data.styles.borderRadius) {
            return 'hidden';
        }
        if (this.isEllipsis() ||
            this.SelfContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Vertical
        ) {
            return 'hidden';
        }
        if (this.SelfContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Horizontal &&
            Dom.calRange(this.data.children).width > this.data.width
        ) {
            return "auto";
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
        if (this.ParentContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Horizontal &&
            this.SelfContrains["LayoutFlex"] == CONTRAIN.LayoutFlex.Auto) {
            return 1;
            // } else if (this.SelfContrains["LayoutFlex"] == CONTRAIN.LayoutFlex.Default) {
        }
    }
    get boxOrient() {
        if (this.SelfContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Horizontal) {
            return 'horizontal'
        }
    }
    get boxPack() {
        if (this.SelfContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Start) {
            return "start"
        } else if (this.SelfContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.Center) {
            return "center"
        } else if (this.SelfContrains["LayoutJustifyContent"] == CONTRAIN.LayoutJustifyContent.End) {
            return "end"
        }
    }
    get boxAlign() {
        if (this.SelfContrains["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.Start) {
            return "start"
        } else if (this.SelfContrains["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.Center) {
            return "center"
        } else if (this.SelfContrains["LayoutAlignItems"] == CONTRAIN.LayoutAlignItems.End) {
            return "end"
        }
    }
    get display() {
        if (this.SelfContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Horizontal) {
            return 'box';
        } else if (this.SelfContrains["LayoutDirection"] == CONTRAIN.LayoutDirection.Vertical) {
            return 'block';
        }


    }
    get textAlign() {
        if (!this.data.text) {
            return;
        }
        if (this.SelfContrains["LayoutSelfHorizontal"]) {
            return Render.align(this.SelfContrains["LayoutSelfHorizontal"].toLowerCase());
        } else if (this.SelfContrains["LayoutJustifyContent"]) {
            // 对齐约束值 比 对齐配置值 大1
            return Render.align(this.SelfContrains["LayoutJustifyContent"].toLowerCase());
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
            // return Render.unit(this.data.styles.lineHeight);
            return this.data.styles.lineHeight / this.data.styles.maxSize;

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
    toHtml(cb) {
        let html = this.html.start;
        this.children.forEach((d, i) => {
            html += d.toHtml()
        });
        html += this.html.end;

        return html;

    }
    /**
     * 输出Css
     * @param  {Render} dom dom节点
     * @return {Css}     Css
     */
    toCss(cb) {
        let css = '';
        if (this.data.isRoot) {
            css += 'html{font-size:13.33333vw;}body{font-size:0;margin:0;}img{font-size:0;display:block;}ul,li{list-style:none;margin:0;padding:0;}';
        }
        if (!cssStyle_cache.includes(this.cssClassName)) {
            cssStyle_cache.push(this.cssClassName);
            css += this.cssStyle;
        }
        css += this.positionStyle;


        this.children.forEach(d => {
            css += d.toCss();
        });
        return css;
    }
    /*  
        判断是否需要省略号
    */
    isEllipsis() {
        // return this.data.model == Store.model.TEXT && this.SelfContrains["LayoutFlex"] == CONTRAIN.LayoutFlex.Auto
        return this.data.text && !!Render.findUntil(this, function (d) {
            return d.SelfContrains["LayoutFlex"] == CONTRAIN.LayoutFlex.Auto;
        })
    }
    // 返回Dom相关样式对象
    getPositionStyleObj() {
        let render = this;
        [
            "overflow",
            "width",
            "height",
            "marginLeft",
            "marginTop",
            "marginRight",
            "marginBottom",
            "padding",
            "left",
            "right",
            "top",
            "bottom",
            "position",
            "zIndex",
            // "flex",
            // "flexBasis",
            // "flexDirection",
            // "flexGrow",
            // "flexShrink",
            // "justifyContent",
            // "alignItems",
            "lineHeight",
            "overflow",
            "boxFlex",
            "boxOrient",
            "boxPack",
            "boxAlign",
            "display",
        ].forEach(key => {
            let value = render[key]
            if (value == undefined) {
                return;
            }
            let name = Common.nameLower(key);
            if (CompatibleKey.includes(name)) {
                render.positionStyleObj['-webkit-' + name] = value;
            } else {
                render.positionStyleObj[name] = value;
            }
            if (CompatibleValue.includes(value)) {
                render.positionStyleObj[name] = '-webkit-' + value;
            }
        });
    }
    getCssStyleObj() {
        let render = this;
        [
            "color",
            "fontFamily",
            "verticalAlign",
            "fontSize",
            "backgroundColor",
            "backgroundImage",
            "backgroundSize",
            "backgroundRepeat",
            "border",
            "boxSizing",
            "borderRadius",
            "shadow",
            "textOverflow",
            "textAlign",
            "whiteSpace",
            "opacity"
        ].forEach(key => {
            let value = render[key]
            if (value == undefined) {
                return;
            }
            let name = Common.nameLower(key);
            if (CompatibleKey.includes(name)) {
                render.cssStyleObj['-webkit-' + name] = value;
            } else {
                render.cssStyleObj[name] = value;
            }
            if (CompatibleValue.includes(value)) {
                render.cssStyleObj[name] = '-webkit-' + value;
            }
        });

    }
    static toRadius(vals, maxSize = 100) {
        if (!(vals instanceof Array)) {
            vals = [vals];
        }
        return vals.map(v => {
            v = v < maxSize / 2 ? v : maxSize / 2;
            return Render.unit(v);
        }).join(' ');
    }
    static findUntil(dom, func) {
        if (func(dom)) {
            return dom
        }
        if (dom.parentNode) {
            return Render.findUntil(dom.parentNode, func);
        }
        return null;
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
        // 1-2像素特殊处理
        if (Math.abs(number) <= Config.dsl.dpr) {
            number = Math.ceil(number / Config.dsl.dpr);
            unit = 'px';
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
        return Object.keys(StyleDom.align).find(k => StyleDom.align[k] == index);
    }
    static alignJustify(index) {
        return {
            1: "left",
            2: "right",
            3: "center"
        } [index]
    }
}

let domIndex = 0;

class TextRender extends Render {
    constructor(o, parentNode) {
        super(o, parentNode);
        this.tagName = 'span';
        this.className = [this.cssClassName];
        this.data.styles = {};
        this.getCssStyleObj();
        return this;
    }
    get cssClassName() {
        return 'span-' + this.index;
    }
    get innerText() {
        return this.data.string || '';
    }
    get color() {
        if (this.data.color) {
            return Render.toRGBA(this.data.color);
        }
    }
    get fontFamily() {
        if (this.data.font) {
            return this.data.font;
        }
    }
    get fontSize() {
        if (this.data.size) {
            return Render.unit(this.data.size);
        }
    }


    // 返回Dom相关样式对象
}
class HtmlRender extends Render {
    constructor(o, parentNode) {
        super(o, parentNode);
        let _render = this;
        if (parentNode) {
            parentNode.children.push(this);
        }
        // 如果文本样式多于1个，则文本拆分成多个节点
        if (this.data.texts && this.data.texts.length > 1) {
            this.data.texts.forEach((t) => {
                _render.children.push(new TextRender(t));
            });
            this.data.texts = null;
            this.data.text = null;
        }
        // 获取样式名
        this.getClassName();
        // 获取标签名
        this.getTagName();
        // 获取定位样式
        this.getPositionStyleObj();
        // 获取表现样式
        this.getCssStyleObj();
        // 获取行内属性
        this.getAttrObj();
        // 获取行内样式
        this.getInlineStyle();
        return this;
    }
    get innerText() {
        return this.data.texts && this.data.texts[0].string || '';
    }
    get positionClassName() {
        return ((this.data.model && this.data.model.name) || 'default').toLowerCase() + '-' + this.index;
    }
    get cssClassName() {
        return 'style-' + this.data.styles.id;
    }
    getClassName() {
        this.className.push(
            this.positionClassName,
            this.cssClassName
        )
    }
    getAttrObj() {
        if (this.data.model == Store.model.IMAGE) {
            this.attrObj["src"] = this.data.path;
        }
        if (Config.output.debug) {
            this.attrObj["data-id"] = this.data.id;
            this.attrObj["data-layout"] = this.data.layout;
            this.attrObj["isSource"] = this.data.source == 'design';
        }
    }
    getInlineStyle() {
        if (this.data.path &&
            this.data.type == Dom.type.IMAGE &&
            this.data.model !== Store.model.IMAGE) {
            this.inlineStyle["background-image"] = `url(${this.data.path})`;
        };

    }
    getTagName() {
        this.tagName = "div";
        if (this.data.model == Store.model.TEXT) {
            this.tagName = 'div';
        } else if (this.data.model == Store.model.IMAGE) {
            this.tagName = "img";
        }
        return this.tagName
    }
}

/**
 * Sketch树转为dom树
 * @param  {JSON} json Sketch树
 * @return {JSON}      dom树
 */
// 兼容属性关键词
const CompatibleKey = ['box-flex', 'box-orient', 'box-pack', 'box-align']
// 兼容属性关键值
const CompatibleValue = ['box']

let Config = {};

function fn(json, parentNode) {
    let dom = new HtmlRender(json, parentNode);
    if (json.children) {
        json.children.forEach(function (j, i) {
            fn(j, dom);
        });
    }
    return dom;
}

function render(data, config) {
    Config = config;
    return fn(data);
}

module.exports = render