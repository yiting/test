let CONTRAIN = require('./dsl_contrain.js');
let Store = require("./dsl_store.js");
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
const STYLE_MAP = {
    'height': 'height',
    'width': 'width',
}
const CLOSING_TAGS = ['img', 'input', 'br'];



class Render {
    constructor() {
        this.styleObj = {}
        this.attrObj = {}
        this.inlineStyle = {};
        this.className = [];
        this.children = [];
        this.tagName = '';
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
        let attrArr = Object.keys(attr).map((key, i) => {
            return `${key}="${attr[key]}"`;
        });
        let styleArr = Object.keys(style).map((key, i) => {
            return `${key}:${style[key]}`;
        });
        if (className.length) {
            attrArr.push('class="' + className.join(' ') + '"');
        }
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
        let rt = this._toCss(this)
        typeof cb == 'function' && cb(rt);
        return rt;
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
}

let domIndex = 0;

function getTextStyleObj(data) {
    let styleObj = {}
    styleObj["font-weight"] = FONT_WEIGHT[data.fontWeight];
    styleObj["font-size"] = Render.unit(data.size);
    styleObj["font-family"] = data.font;
    styleObj['color'] = Render.toRGBA(data.color);
    return styleObj
}
class Text extends Render {
    constructor(o, parentNode) {
        super(o, parentNode);
        this.index = domIndex++;
        this._data = o;
        this.parentNode = parentNode;
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
    constructor(o, parentNode, prevNode) {
        super(o, parentNode, prevNode);
        let _render = this;
        this.index = domIndex++;
        this._data = o;
        this.parentNode = parentNode;
        this.prevNode = prevNode
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
        this.cleanStyle();
        return this;
    }
    get innerText() {
        return this._data.text || '';
    }
    getClassName() {
        this.className.push(this._data.type + '-' + this.index);
        // this.className.push('sk' + this._data.id);
        // 第二期，根据dom结构输出class
    }
    getAttrObj() {
        // this.attrObj["data-type"] = this._data.type
        if (this._data.path && this.tagName == "img") {
            let bgImage = this._data.path;
            this.attrObj["src"] = bgImage;
        }
    }
    getInlineStyle() {
        if (this._data.path && this._data.type != Store.type.IMAGE) {
            this.inlineStyle["background-image"] = `url(${this._data.path})`;
        };
    }
    getTagName() {
        this.tagName = "div";
        if (this._data.type == Store.type.TEXT) {
            this.tagName = 'span';
        } else if (this._data.type == Store.type.IMAGE) {
            this.tagName = "img";
        }
        return this.tagName
    }
    // 返回Dom相关样式对象
    getStyleObj() {
        /**
         * contrains
         */
        if (this._data.id == "EF9E1FF9-5F58-4A09-B08E-84F027BFD09E") {
            debugger;
        }
        if (this._data.contrains) {
            // 布局方向
            if (this._data.contrains[CONTRAIN.LayoutHorizontal]) {
                this.styleObj["display"] = 'flex';
                this.styleObj['flex-direction'] = 'row';
            } else if (this._data.contrains[CONTRAIN.LayoutVertical]) {
                this.styleObj["display"] = 'flex';
                this.styleObj['flex-direction'] = 'column';
            } else if (this._data.contrains[CONTRAIN.LayoutAlignItemsAbsolute]) {
                this.styleObj['display'] = 'block';
            }
            // 横轴
            if (this._data.contrains[CONTRAIN.LayoutJustifyContentBetween]) {
                this.styleObj['justify-content'] = 'space-between;';
            } else if (this._data.contrains[CONTRAIN.LayoutJustifyContentStart]) {
                this.styleObj['justify-content'] = 'start';
            } else if (this._data.contrains[CONTRAIN.LayoutJustifyContentEnd]) {
                this.styleObj['justify-content'] = 'end';
            } else if (this._data.contrains[CONTRAIN.LayoutJustifyContentCenter]) {
                this.styleObj['justify-content'] = 'center';
            }
            // 纵轴
            if (this._data.contrains[CONTRAIN.LayoutAlignItemsStart]) {
                this.styleObj['align-items'] = 'flex-start';
            } else if (this._data.contrains[CONTRAIN.LayoutAlignItemsEnd]) {
                this.styleObj['align-items'] = 'flex-end';
            } else if (this._data.contrains[CONTRAIN.LayoutAlignItemsCenter]) {
                this.styleObj['align-items'] = 'center';
            }
            if (this._data.contrains[CONTRAIN.LayoutAlignItemsAbsolute]) {
                this.styleObj['position'] = 'relative';
            }
        }
        /**
         * position
         */
        if (this.parentNode && this.parentNode._data.contrains) {
            let ParentContrains = this.parentNode._data.contrains;
            if (ParentContrains[CONTRAIN.LayoutHorizontal]) {
                // 水平
                if (this.prevNode) {
                    this.styleObj['margin-left'] = Render.unit(this._data.x - this.prevNode._data.x - this.prevNode._data.width);
                } else if (!ParentContrains[CONTRAIN.LayoutJustifyContentCenter]) {
                    this.styleObj['margin-left'] = Render.unit(this._data.x);
                }
                if (ParentContrains[CONTRAIN.LayoutAlignItemsStart]) {
                    this.styleObj['margin-top'] = Render.unit(this._data.y);
                } else if (ParentContrains[CONTRAIN.LayoutAlignItemsEnd]) {
                    this.styleObj['margin-bottom'] = Render.unit(this.parentNode.height - this._data.y - this._data.height);
                }
            } else if (ParentContrains[CONTRAIN.LayoutVertical]) {
                // 垂直
                if (this.prevNode) {
                    this.styleObj['margin-top'] = Render.unit(this._data.y - this.prevNode._data.y - this.prevNode._data.height);
                } else if (!ParentContrains[CONTRAIN.LayoutJustifyContentCenter]) {
                    this.styleObj['margin-top'] = Render.unit(this._data.y);
                }
                if (ParentContrains[CONTRAIN.LayoutAlignItemsStart]) {
                    this.styleObj['margin-left'] = Render.unit(this._data.x);
                } else if (ParentContrains[CONTRAIN.LayoutAlignItemsEnd]) {
                    this.styleObj['margin-right'] = Render.unit(this.parentNode.width - this._data.x - this._data.width);
                }
            } else if (ParentContrains[CONTRAIN.LayoutAlignItemsAbsolute]) {
                this.styleObj['position'] = 'absolute';
                this.styleObj['left'] = Render.unit(this._data.x);
                this.styleObj['top'] = Render.unit(this._data.y);
            }
        } else if (this._data.type != 'QBody') {
            this.styleObj['position'] = 'absolute';
            this.styleObj['left'] = Render.unit(this._data.x);
            this.styleObj['top'] = Render.unit(this._data.y);
        }
        /**
         * box
         */
        if (this._data.type == 'QBody') {
            this.styleObj['width'] = '100%';
        } else {
            this.styleObj['width'] = Render.unit(this._data.width);
            this.styleObj['height'] = Render.unit(this._data.height);
        }
        /**
         * background
         */
        if (this._data.path && this._data.type != Store.type.IMAGE) {
            this.styleObj["background-position"] = "center";
            this.styleObj["background-repeat"] = "no-repeat";
            this.styleObj["background-size"] = "contain";
            // this.styleObj["background-color"] = '#CCC';
        }
        if (this._data.padding) {
            this.styleObj.padding = [
                Render.unit(this._data.padding.top),
                Render.unit(this._data.padding.right),
                Render.unit(this._data.padding.bottom),
                Render.unit(this._data.padding.left),
            ].join(' ');
        }

        // 通过行高判断是否换行
        if (this._data.lines == 1) {
            this.styleObj["white-space"] = "nowrap"
        }
        /**
         * styles 处理
         */
        if (!this._data.styles) {
            return;
        }
        if (this._data.styles.background) {
            if (this._data.styles.background.type == 'color') {
                this.styleObj["background-color"] = Render.toRGBA(this._data.styles.background.color);
            } else if (this._data.styles.background.type == 'linear') {
                this.styleObj["background-image"] = Render.calLinearGradient(this._data.styles.background, this._data.width, this._data.height);
            }
        }
        if (this._data.styles.lineHeight) {
            this.styleObj["line-height"] = Render.unit(this._data.styles.lineHeight);
        }
        if (this._data.styles.textAlign) {
            this.styleObj["text-align"] = this._data.styles.textAlign;
        }

        /**
         * opacity
         */
        if (this._data.styles.opacity) {
            this.styleObj["opacity"] = this._data.styles.opacity;
        }

        /**
         * box
         */
        if (this._data.styles.borderRadius) {
            this.styleObj["border-radius"] = Render.unit(this._data.styles.borderRadius);
        }
        if (this._data.styles.border && this._data.styles.border.width) {
            // let type = this._data.border["position"] == "outside" ? "outline" : "border",
            let borderType = Render.borderType(this._data.styles.border.type),
                borderWidth = Render.unit(this._data.styles.border.width),
                borderColor = Render.toRGBA(this._data.styles.border.color);
            this.styleObj['border'] = [borderWidth, borderType, borderColor].join(' ');
            this.styleObj["box-sizing"] = "border-box";
        }


    }
    cleanStyle() {
        if (this._data.styleAuto) {
            Object.keys(this._data.styleAuto).forEach((key) => {
                delete this.styleObj[STYLE_MAP[key]];
            });
        }
    }
}
/**
 * Sketch树转为dom树
 * @param  {JSON} json Sketch树
 * @return {JSON}      dom树
 */

var Config = {};

function fn(json, parent, prev) {
    var dom = new DOM(json, parent, prev);
    if (json.children) {
        let prev = null;
        json.children.forEach(function(j, i) {
            prev = fn(j, dom, prev);
        });
    }
    return dom;
}

function render(data, conf) {
    Config = conf;
    return fn(data);
}

module.exports = render