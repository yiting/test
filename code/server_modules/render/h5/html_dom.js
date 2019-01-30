const Common = require('../../dsl2/dsl_common.js');
const QLog = require("../../log/qlog");
const Loger = QLog.getInstance(QLog.moduleData.render);

class HtmlDom {
    constructor(node, parentNode) {
        // super(node)
        this.children = [];
        this.parentNode = parentNode || null;
        this.id = node.id;
        this.serialId = node.serialId;
        this.similarId = node.similarId;
        this.modelId = node.modelId;
        this.modelName = node.modelName;
        this.tagName = node.tagName;
        this.isClosedTag = node.isClosedTag;
        this.text = node.text;
        this.abX = node.abX || 0;
        this.abY = node.abY || 0;
        this.width = node.width || 0;
        this.height = node.height || 0;
        this.path = node.path || null;
        this.contrains = node.contrains || {};
        this.tplAttr = node.tplAttr || {};

        this.selfClassName = node.selfClassName;
        this.similarClassName = node.similarClassName;
    }
    get x() {
        return this.parent ? (this.abX - this.parent.abX) : this.abX
    }
    get y() {
        return this.parent ? (this.abY - this.parent.abY) : this.abY
    }
    getAttrClass() {
        var result = [],
            _cssDom = _cssDomMap[this.id],
            _simCssDom = _similarCssDomMap[this.similarId];
        if (!_simCssDom || _cssDom.getCss(_simCssDom)) {
            result.push(this.selfClassName);
        }
        if (this.similarClassName) {
            result.push(this.similarClassName);
        }


        if (result.length) {
            return `class="${result.join(' ')}"`;
        } else {
            return ``;
        }
    }
    getTag() {
        return this.tagName || 'div';
    }
    getContent() {
        return this.text || '';
    }
    getAttrs() {
        var result = [];
        if (this.tplAttr) {
            result.push(...Object.keys(this.tplAttr).map(key => {
                if (key != "data-model") {
                    return `${key}="${this.tplAttr[key]}"`;
                }
            }))
        }
        return result.join(' ');
    }
    // 开始节点
    getHtmlStart(_layoutType) {
        if (_layoutType == Common.TestLayout) {
            let modelName = this.modelName ? `md="${this.modelName}"` : '';
            return `<${this.getTag()} ${this.id} ${this.similarId?'sim='+this.similarId:''} ${modelName} ${this.getAttrClass()} ${this.getAttrs()}>${this.getContent()}`
            // return `<${this.getTag()} ${this.getAttrClass()} ${this.getAttrs()}>${this.getContent()}`
        }
        return `<${this.getTag()} ${this.getAttrClass()} ${this.getAttrs()}>${this.getContent()}`
    }
    // 闭合节点
    getHtmlEnd() {
        return this.isClosedTag ? '' : `</${this.getTag()}> `
    }
}
let _htmlDomTree,
    _cssDomMap,
    _similarCssDomMap

/**
 * 构建htmlDom树
 * @param {Object} parent 
 * @param {Json} data 
 */
let _buildTree = function (data, parent) {
    try {
        let htmlNode = new HtmlDom(data, parent);
        // 构建树
        if (!parent) {
            _htmlDomTree = htmlNode;
        } else {
            parent.children.push(htmlNode);
        }
        data.children.forEach(child => {
            _buildTree(child, htmlNode);
        });
    } catch (e) {
        Loger.error(`html_dom.js [_buildTree] ${e},params[data.id:${data&&data.id},parent.id:${parent&&parent.id}]`);
    }
}

function process(data, cssDomMap, similarCssDomMap) {

    Loger.debug(`html_dom.js [process]`);
    _htmlDomTree = null;
    _cssDomMap = cssDomMap;
    _similarCssDomMap = similarCssDomMap;
    Loger.debug(`html_dom.js [_buildTree]`);
    _buildTree(data, _htmlDomTree);
    return _htmlDomTree;
}

function getHtmlString(htmlDom, _layoutType) {
    // 遍历循环
    let html = htmlDom.getHtmlStart(_layoutType);
    if (htmlDom.children) {
        htmlDom.children.forEach(child => {
            html += getHtmlString(child, _layoutType);
        });
    }
    html += htmlDom.getHtmlEnd();
    return html;
}


module.exports = {
    process,
    getHtmlString,
}