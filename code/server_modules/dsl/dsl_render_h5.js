const CONTRAIN = require('./dsl_contrain.js');
const Common = require('./dsl_common.js');
const Store = require("./dsl_store.js");
// domtree
const DOM_NULL = '<null>';
const FONT_WEIGHT = {
    "thin": 100, //Thin
    "extra": 200, //Extra Light (Ultra Light)
    "light": 300, //Light
    "regular": 400, //Regular (Normal、Book、Roman)
    "medium": 500, //Medium
    "semibold": 600, //Semi Bold (Demi Bold)
    "bold": 700, //Bold
    "extra": 800, //Extra Bold (Ultra Bold)
    "black": 900, //Black (Heavy)
}
const ALIGN_MAP = {
    0: "left",
    1: "right",
    2: "center"
}
const STYLE_MAP = {
    'height': 'height',
    'width': 'width',
}
const CLOSING_TAGS = ['img', 'input', 'br'];



class Render {
    constructor(o, parentNode) {
        this.styleObj = {}
        this.attrObj = {}
        this.inlineStyle = {};
        this.className = [];
        this.children = [];
        this.tagName = '';
        this._data = o;
        this.parentNode = parentNode;
    }

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
    get html() {
        let attr = this.attrObj,
            style = this.inlineStyle || '',
            className = this.className
        let attrArr = [];
        let styleArr = Object.keys(style).map((key, i) => {
            return `${key}:${style[key]}`;
        });
        if (className.length) {
            attrArr.push('class="' + className.join(' ') + '"');
        }
        Object.keys(attr).forEach((key, i) => {
            attrArr.push(`${key}="${attr[key]}"`);
        });
        if (styleArr.length) {
            attrArr.push('style="' + styleArr.join(';') + '"')
        }
        let attrStr = attrArr.join(' ');

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
    get jade() {
        let attr = this.attrObj,
            style = this.inlineStyle || ''

        let attrArr = Object.keys(attr).map((key, i) => {
            return `${key}="${attr[key]}"`
        });
        let className = this.className.map(function(c, i) {
            return '.' + c;
        }).join('');
        let styleArr = Object.keys(style).map((key, i) => {
            return `${key}:${style[key]}`;
        });
        if (styleArr.length) {
            attrArr.push('style="' + styleArr.join(';') + '"');
        }
        let attrStr = attrArr.length ? '(' + attrArr.join(',') + ')' : '';
        return this.tagName + className + attrStr + ' ' + this.innerText
    }
    get filter() {
        let filter = [];
        if (this._data.styles && this._data.styles.shadows) {
            this._data.styles.shadows.forEach((s, i) => {
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
        return this.parentNode && this.parentNode._data.children[this.parentNode._data.children.indexOf(this._data) - 1];
    }
    get nextData() {
        return this.parentNode && this.parentNode._data.children[this.parentNode._data.children.indexOf(this._data) + 1];
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
     * 输出Jade
     * @param  {Render} dom   dom节点
     * @param  {Number} level 层级
     * @return {Jade}       Jade
     */
    _toJade(dom, level = 0) {
        let spaces = new Array(level * 4).join(' ');
        let str = spaces + dom.jade + '\n';
        dom.children.forEach((d, i) => {
            str += this._toJade(d, level + 1);
        });
        return str;
    }

    toJade(cb) {
        let rt = this._toJade(this)
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
        let base = 'html{font-size:13.33333vw;}body{margin:0;}img{font-size:0}ul,li{list-style:none;margin:0;padding:0;}';
        let rt = this._toCss(this)
        typeof cb == 'function' && cb(rt);
        return base + rt;
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
        return FONT_WEIGHT[weight]

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
        return ALIGN_MAP[index];
    }
}
/**
 * 计算margin
 */
function calMargin(cur, parent, prev, next, direction) {
    // 水平布局
    if (!parent) {
        return {};
    }
    let o = {};
    if (parent.contrains[CONTRAIN.LayoutHorizontal]) {
        o["left"] = cur.x - (prev ? (prev.x + prev.width) : 0)
        o["right"] = (next ? next.x : parent.width) - cur.x - cur.width;
        o["top"] = cur.y;
        o["bottom"] = parent.height - cur.y - cur.height;
    } else if (parent.contrains[CONTRAIN.LayoutVertical]) {
        o["top"] = cur.y - (prev ? (prev.y + prev.height) : 0)
        o["bottom"] = (next ? next.y : parent.height) - cur.y - cur.height;
        o["left"] = cur.x;
        o["right"] = parent.width - cur.x - cur.width;
    } else {
        o["left"] = o.x;
        o["right"] = parent.width - o.x - o.width;
        o["top"] = o.y;
        o["bottom"] = parent.height - o.y - o.height;
    }
    return o;
}

let domIndex = 0;

function getTextStyleObj(data) {
    let styleObj = {}
    styleObj["font-size"] = Render.unit(data.size);
    styleObj["font-family"] = data.font;
    styleObj["white-space"] = "pre";
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
        return this._data.string;
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

        if (this._data.text && this._data.styles.texts.length > 1) {
            this._data.styles.texts.forEach((t) => {
                _render.children.push(new Text(t));
            });
            this._data.text = '';
        } else if (this._data.text) {
            Object.assign(this.styleObj, getTextStyleObj(this._data.styles.texts[0]))
        }
        this.getClassName();
        this.getTagName();
        this.getStyleObj();
        this.getAttrObj();
        this.getInlineStyle();
        return this;
    }
    get innerText() {
        return this._data.text || '';
    }
    getClassName() {
        this.className.push((this._data.type || this._data.layout) + '-' + this.index);
        // this.className.push('sk' + this._data.id);
        // 第二期，根据dom结构输出class
    }
    getAttrObj() {
        if (this._data.type == Store.model.IMAGE) {
            let bgImage = this._data.path;
            this.attrObj["src"] = bgImage;
        }
        this.attrObj["data-id"] = this._data.id;
        this.attrObj["data-layout"] = this._data.layout;
    }
    getInlineStyle() {
        if (this._data.path && this._data.type != Store.model.IMAGE) {
            this.inlineStyle["background-image"] = `url(${this._data.path})`;
            this.inlineStyle["white-space"] = "pre";
        };
    }
    getTagName() {
        this.tagName = "div";
        if (this._data.layout == Store.layout.UL) {
            this.tagName = 'ul'
        } else if (this._data.type == Store.model.TEXT) {
            this.tagName = 'div';
        } else if (this._data.type == Store.model.IMAGE) {
            this.tagName = "img";
        } else if (this.parentNode && this.parentNode._data.layout == Store.layout.UL) {
            this.tagName = 'li';
        }
        return this.tagName
    }
    // 返回Dom相关样式对象
    getStyleObj() {
        /**
         * contrains
         */
        /**
         *  父节点有约束
         */
        let curData = this._data,
            parentData = this.parentNode && this.parentNode._data,
            prevData = this.prevData,
            nextData = this.nextData
        const SelfContrain = curData.contrains || {},
            ParentContrains = this.parentNode && this.parentNode._data.contrains;
        if (this.parentNode && Object.keys(ParentContrains).length) {
            if (ParentContrains[CONTRAIN.LayoutHorizontal]) {
                // 水平
                if (ParentContrains[CONTRAIN.LayoutJustifyContentStart]) {

                    this.styleObj['margin-left'] = Render.unit(curData.x - (prevData ? (prevData.x + prevData.width) : 0));
                } else if (ParentContrains[CONTRAIN.LayoutJustifyContentCenter]) {
                    if (prevData) {
                        this.styleObj['margin-left'] = Render.unit(curData.x - prevData.x - prevData.width);
                    }
                } else if (ParentContrains[CONTRAIN.LayoutJustifyContentEnd]) {
                    this.styleObj['margin-right'] = Render.unit((nextData ? nextData.x : parentData.width) - curData.x - curData.width);
                } else {
                    this.styleObj['margin-left'] = Render.unit(curData.x - (prevData ? (prevData.x + prevData.width) : 0));
                }
                if (!ParentContrains[CONTRAIN.LayoutAlignItemsStart] &&
                    !ParentContrains[CONTRAIN.LayoutAlignItemsCenter] &&
                    !ParentContrains[CONTRAIN.LayoutAlignItemsEnd] &&
                    !SelfContrain[CONTRAIN.LayoutSelfAbsolute]
                ) {
                    this.styleObj['margin-top'] = Render.unit(curData.y);
                }
            } else if (ParentContrains[CONTRAIN.LayoutVertical]) {
                // 垂直
                if (ParentContrains[CONTRAIN.LayoutJustifyContentStart]) {
                    this.styleObj['margin-top'] = Render.unit(curData.y - (prevData ? (prevData.y + prevData.height) : 0));
                } else if (ParentContrains[CONTRAIN.LayoutJustifyContentCenter]) {
                    if (prevData) {
                        this.styleObj['margin-top'] = Render.unit(curData.y - prevData.y - prevData.height);
                    }
                } else if (ParentContrains[CONTRAIN.LayoutJustifyContentEnd]) {
                    this.styleObj['margin-bottom'] = Render.unit((nextData ? nextData.y : parentData.height) - curData.y - curData.height);
                } else {
                    this.styleObj['margin-top'] = Render.unit(curData.y - (prevData ? (prevData.y + prevData.height) : 0));
                }
                if (!ParentContrains[CONTRAIN.LayoutAlignItemsStart] &&
                    !ParentContrains[CONTRAIN.LayoutAlignItemsCenter] &&
                    !ParentContrains[CONTRAIN.LayoutAlignItemsEnd] &&
                    !SelfContrain[CONTRAIN.LayoutSelfAbsolute]
                ) {
                    this.styleObj['margin-left'] = Render.unit(curData.x);
                }
            } else if (ParentContrains[CONTRAIN.LayoutAbsolute]) {
                this.styleObj['position'] = 'absolute';
                this.styleObj['left'] = Render.unit(curData.x);
                this.styleObj['top'] = Render.unit(curData.y);
            }
        } else if (curData.type != Store.model.BODY) {
            this.styleObj['position'] = 'absolute';
            this.styleObj['left'] = Render.unit(curData.x);
            this.styleObj['top'] = Render.unit(curData.y);
        }
        /**
         * 自约束转换
         */
        if (Object.keys(SelfContrain).length) {
            // 布局方向
            if (SelfContrain[CONTRAIN.LayoutHorizontal]) {
                this.styleObj["display"] = 'flex';
                this.styleObj['flex-direction'] = 'row';
            } else if (SelfContrain[CONTRAIN.LayoutVertical]) {
                this.styleObj["display"] = 'flex';
                this.styleObj['flex-direction'] = 'column';
            }
            // 横轴
            if (SelfContrain[CONTRAIN.LayoutJustifyContentBetween]) {
                this.styleObj['justify-content'] = 'space-between;';
            } else if (SelfContrain[CONTRAIN.LayoutJustifyContentStart]) {
                this.styleObj['justify-content'] = 'start';
            } else if (SelfContrain[CONTRAIN.LayoutJustifyContentEnd]) {
                this.styleObj['justify-content'] = 'end';
            } else if (SelfContrain[CONTRAIN.LayoutJustifyContentCenter]) {
                this.styleObj['justify-content'] = 'center';
            }
            // 纵轴
            if (SelfContrain[CONTRAIN.LayoutAlignItemsStart]) {
                this.styleObj['align-items'] = 'flex-start';
            } else if (SelfContrain[CONTRAIN.LayoutAlignItemsEnd]) {
                this.styleObj['align-items'] = 'flex-end';
            } else if (SelfContrain[CONTRAIN.LayoutAlignItemsCenter]) {
                this.styleObj['align-items'] = 'center';
            }
            if (SelfContrain[CONTRAIN.LayoutAutoFlex]) {
                this.styleObj['flex'] = '1';
            }


            /**
             * 绝对定位
             */
            if (SelfContrain[CONTRAIN.LayoutSelfAbsolute]) {
                this.styleObj["position"] = "absolute";
                let pos = Common.calPosition(curData, parentData);
                this.styleObj['left'] = SelfContrain[CONTRAIN.LayoutSelfLeft] && Render.unit(pos.left);
                this.styleObj['right'] = SelfContrain[CONTRAIN.LayoutSelfRight] && Render.unit(pos.right);
                this.styleObj['top'] = SelfContrain[CONTRAIN.LayoutSelfTop] && Render.unit(pos.top);
                this.styleObj['bottom'] = SelfContrain[CONTRAIN.LayoutSelfBottom] && Render.unit(pos.bottom);
            } else {
                this.styleObj['position'] = 'relative';
                /**
                 * 自身相关描述 - Margin
                 */
                let margin = Common.calMargin(curData, parentData, prevData, nextData,
                    (ParentContrains && ParentContrains[CONTRAIN.LayoutHorizontal] && 'x') ||
                    (ParentContrains && ParentContrains[CONTRAIN.LayoutVertical] && 'y')
                );
                // 上边距
                if (SelfContrain[CONTRAIN.LayoutTopMargin]) {
                    this.styleObj["margin-top"] = Render.unit(margin["top"]);
                } else if (SelfContrain[CONTRAIN.LayoutTopMargin] === false) {
                    this.styleObj["margin-top"] = '0'
                }
                // 右边距
                if (SelfContrain[CONTRAIN.LayoutRightMargin]) {
                    this.styleObj["margin-right"] = Render.unit(margin["right"]);
                } else if (SelfContrain[CONTRAIN.LayoutRightMargin] === false) {
                    this.styleObj["margin-right"] = '0'
                }
                // 下边距
                if (SelfContrain[CONTRAIN.LayoutBottomMargin]) {
                    this.styleObj["margin-bottom"] = Render.unit(margin["bottom"]);
                } else if (SelfContrain[CONTRAIN.LayoutBottomMargin] === false) {
                    this.styleObj["margin-bottom"] = '0'
                }
                // 左边距
                if (SelfContrain[CONTRAIN.LayoutLeftMargin]) {
                    this.styleObj["margin-left"] = Render.unit(margin["left"]);
                } else if (SelfContrain[CONTRAIN.LayoutLeftMargin] === false) {
                    this.styleObj["margin-left"] = '0'
                }
            }
        }

        // height,width
        if (SelfContrain[CONTRAIN.LayoutFixedHeight]) {
            // 固定高度
            this.styleObj["height"] = Render.unit(curData.height);
        }
        if (SelfContrain[CONTRAIN.LayoutFixedWidth]) {
            // 固定宽度
            this.styleObj["width"] = Render.unit(curData.width)
        }
        /**
         * box
         */
        if (curData.type == Store.model.BODY) {
            this.styleObj['width'] = '100%';
        }
        /**
         * background
         */
        if (curData.path && curData.type != Store.model.IMAGE) {
            this.styleObj["background-position"] = "center";
            this.styleObj["background-repeat"] = "no-repeat";
            this.styleObj["background-size"] = "contain";
        }
        if (curData.padding) {
            this.styleObj.padding = [
                Render.unit(curData.padding.top),
                Render.unit(curData.padding.right),
                Render.unit(curData.padding.bottom),
                Render.unit(curData.padding.left),
            ].join(' ');
        }

        // 通过行高判断是否换行
        if (curData.lines == 1) {
            this.styleObj["white-space"] = "nowrap";
            this.styleObj["overflow"] = "hidden";
            this.styleObj["text-overflow"] = "ellipsis";
        }
        /**
         * styles 处理
         */
        if (!curData.styles) {
            return;
        }
        if (curData.styles.background) {
            if (curData.styles.background.type == 'color') {
                this.styleObj["background-color"] = Render.toRGBA(curData.styles.background.color);
            } else if (curData.styles.background.type == 'linear') {
                this.styleObj["background-image"] = Render.calLinearGradient(curData.styles.background, curData.width, curData.height);
            }
        }
        if (curData.styles.lineHeight) {
            this.styleObj["line-height"] = Render.unit(curData.styles.lineHeight);
        }
        if (curData.styles.textAlign) {
            this.styleObj["text-align"] = Render.align(curData.styles.textAlign);
        }

        /**
         * opacity
         */
        if (curData.styles.opacity) {
            this.styleObj["opacity"] = curData.styles.opacity;
        }

        /**
         * box
         */
        if (curData.styles.borderRadius) {
            this.styleObj["border-radius"] = Render.unit(curData.styles.borderRadius);
        }
        if (curData.styles.border && curData.styles.border.width) {
            // let type = curData.border["position"] == "outside" ? "outline" : "border",
            let borderType = Render.borderType(curData.styles.border.type),
                borderWidth = Render.unit(curData.styles.border.width),
                borderColor = Render.toRGBA(curData.styles.border.color);
            this.styleObj['border'] = [borderWidth, borderType, borderColor].join(' ');
            this.styleObj["box-sizing"] = "border-box";
        }

    }
}
/**
 * Sketch树转为dom树
 * @param  {JSON} json Sketch树
 * @return {JSON}      dom树
 */

var Config = {};

function fn(json, parentNode) {
    var dom = new DOM(json, parentNode);
    if (json.children) {
        json.children.forEach(function(j, i) {
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