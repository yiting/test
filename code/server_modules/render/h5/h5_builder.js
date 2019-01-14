// 此模块为h5解析模块

const Builder = require('../render_builder');
const CssDom = require('./css_dom');
const SimilarCssDom = require('./similar_css_dom');
const HtmlDom = require("./html_dom");

let htmlDom, cssDom, similarCss;
class H5Builder extends Builder {
    constructor(data, layoutType) {
        super(data, layoutType);
    }

    // 解析逻辑
    _parseData() {
        this._parseHtml();
        this._parseCss();
    }

    // 解析html
    _parseHtml() {
        htmlDom = HtmlDom.process(this._data, this._layoutType);
    }

    // 解析样式
    _parseCss() {
        cssDom = CssDom.process(this._data, this._layoutType);
        similarCss = SimilarCssDom.process(cssDom, this._layoutType);
    }

    getTagString() {
        this._tagString = HtmlDom.getHtmlString(htmlDom);
        return this._tagString;
    }
    getStyleString() {
        this._styleString = SimilarCssDom.getCssString(similarCss) + CssDom.getCssString(cssDom, similarCss);
        return this._styleString;
    }

    // 获取h5模板
    _getTpl() {
        return HtmlDom.getHtmlTpl();
    }
}


module.exports = H5Builder;