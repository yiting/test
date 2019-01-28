// 此模块为h5解析模块
const Common = require('../../dsl2/dsl_common.js');
const Builder = require('../builder');
const CssDom = require('./css_dom');
const SimilarCssDom = require('./similar_css_dom');
const HtmlDom = require("./html_dom");
const fs = require('fs');
const path = require('path');

let tpl = {
    html: null,
    test: null
}

let htmlDom, cssDomTree, similarCssArr;
class H5Builder extends Builder {
    constructor(data, layoutType) {
        super(data, layoutType);
        // html
        let tplHtmlPath = path.join(__dirname, 'tpl.html');
        tpl.html = fs.readFileSync(tplHtmlPath, "utf-8");
        // test html
        let tplTestPath = path.join(__dirname, 'test_tpl.html');
        tpl.test = fs.readFileSync(tplTestPath, "utf-8");
    }

    // 解析逻辑
    _parseData() {
        this._parseCss();
        this._parseHtml();
    }

    // 解析html
    _parseHtml() {
        htmlDom = HtmlDom.process(this._data, CssDom.getCssMap(cssDomTree, similarCssArr), this._layoutType);
    }

    // 解析样式
    _parseCss() {
        cssDomTree = CssDom.process(this._data, this._layoutType);
        similarCssArr = SimilarCssDom.process(cssDomTree, this._layoutType);
    }

    getTagString() {
        this._tagString = HtmlDom.getHtmlString(htmlDom, this._layoutType);
        return this._tagString;
    }
    getStyleString() {
        this._styleString = SimilarCssDom.getCssString(similarCssArr, this._layoutType) +
            CssDom.getCssString(cssDomTree, similarCssArr, this._layoutType);
        return this._styleString;
    }

    // 获取h5模板
    _getTpl() {
        if (this._layoutType == Common.TestLayout) {
            return tpl.test
        }
        return tpl.html;
    }
}


module.exports = H5Builder;