// 此模块为h5解析模块

const Builder = require('../render_builder');
const CssDom = require('./css_dom.js');
const HtmlDom = require("./html_dom");


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
        this._tagString = HtmlDom.process(this._data, this._layoutType);
    }

    // 解析样式
    _parseCss() {
        CssDom.process(this._data, this._layoutType);
        this._styleString = CssDom.getCssString();
    }

    // 获取h5模板
    _getTpl(){
        return HtmlDom.getHtmlTpl();
    }
}


module.exports = H5Builder;

