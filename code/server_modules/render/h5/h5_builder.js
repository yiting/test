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

let htmlDom, cssDomTree, similarCssArr,
    _domCache,
    _classCache, _similarClassCache
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
        _domCache = {};
        _classCache = {};
        _similarClassCache = {}
        this._parseClassName(this._data);
        this._parseCss();
        this._parseHtml();
    }

    _parseClassName(data) {
        /**
         * self
         */
        let selfPrefix = '';
        let modelNode = _domCache[data.modelId],
            parentNode = _domCache[data.parentId]
        let selfClassName = data.tplAttr.class || 'ui',
            targetName
        /* if (data.modelId != data.id && modelNode) {
            selfPrefix = modelNode.selfClass
            let className = [selfPrefix, selfClassName].join(' ');
            data.selfClass = _classCache[className] ? selfClassName + '-' + data.serialId : selfClassName;
        } else if (parentNode) {
            selfPrefix = parentNode.selfClass
            let className = [selfPrefix, selfClassName].join(' ');
            data.selfClass = _classCache[className] ? selfClassName + '-' + data.serialId : selfClassName;
        } else {
            data.selfClass = selfClassName + '-' + data.serialId;
        } */
        if (data.modelId != data.id && modelNode) {
            selfPrefix = modelNode.selfClassName
            selfClassName = modelNode.tplAttr.class + '-' + selfClassName
            let className = [selfPrefix, selfClassName].join(' ');
            selfClassName = _classCache[className] ? selfClassName + data.serialId : selfClassName;
            data.selfClassName = selfClassName
            data.selfCssName = [selfPrefix, selfClassName];
        } else if (parentNode) {
            selfPrefix = parentNode.selfClassName
            selfClassName = parentNode.tplAttr.class + '-' + selfClassName
            let className = [selfPrefix, selfClassName].join(' ');
            // 如果存在样式，则加后缀
            selfClassName = _classCache[className] ? selfClassName + data.serialId : selfClassName;
            data.selfClassName = selfClassName
            data.selfCssName = [selfPrefix, selfClassName];

        } else if (!parentNode) {
            data.selfClassName = selfClassName;
            data.selfCssName = [selfClassName];
        } else {
            data.selfClassName = selfClassName + data.serialId;
            data.selfCssName = [selfClassName + data.serialId];
        }

        _classCache[data.selfCssName.join(' ')] = true;

        /**
         * similar
         */
        if (_similarClassCache[data.similarId]) {
            data.similarClassName = _similarClassCache[data.similarId].similarClassName;
            data.similarCssName = _similarClassCache[data.similarId].similarCssName;
        } else if (data.similarId) {
            let similarPrefix = '',
                similarParent = _domCache[data.similarParentId],
                similarClassName = '_' + (data.tplAttr.class || data.tagName);
            if (similarParent) {
                similarPrefix = similarParent.similarClassName;
                similarClassName = similarParent.tplAttr.class + similarClassName
                className = [similarPrefix, similarClassName].join(' ');
                similarClassName = _classCache[className] ? similarClassName + data.similarId : similarClassName;
                data.similarClassName = similarClassName;
                data.similarCssName = [similarPrefix, similarClassName]
            } else {
                data.similarClassName = similarClassName + data.similarId;
                data.similarCssName = [similarClassName + data.similarId]
            }

            _similarClassCache[data.similarId] = {
                similarClassName: data.similarClassName,
                similarCssName: data.similarCssName,
            };
            _classCache[data.similarCssName.join(' ')] = true;
        }
        _domCache[data.id] = data;

        data.children.forEach(d => {
            this._parseClassName(d);
        })
    }

    // 解析html
    _parseHtml() {
        htmlDom = HtmlDom.process(this._data, CssDom.getCssMap(cssDomTree), similarCssArr, this._layoutType);
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