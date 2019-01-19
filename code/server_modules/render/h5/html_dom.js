const Common = require('../../dsl2/dsl_common.js');

class HtmlDom {
    constructor(node, parentNode, css) {
        // super(node)
        this.children = [];
        this.parentNode = parentNode || null;
        this.id = node.id;
        this.serialId = node.serialId;
        this.similarId = node.similarId;
        this.modelId = node.modelId;
        this.modelName = node.modelName;
        this.tagName = node.tagName;
        this.text = node.text;
        this.abX = node.abX || 0;
        this.abY = node.abY || 0;
        this.width = node.width || 0;
        this.height = node.height || 0;
        this.path = node.path || null;
        this.contrains = node.contrains || {};
        this.tplAttr = node.tplAttr || {};
        this.tplData = node.tplData || {};
        this.css = css;
    }
    get x() {
        return this.parent ? (this.abX - this.parent.abX) : this.abX
    }
    get y() {
        return this.parent ? (this.abY - this.parent.abY) : this.abY
    }
    getAttrClass() {

        var result = [];
        if (this.similarId) {
            result.push('sim' + this.similarId);
        }
        if (this.tplData && this.tplData.class) {
            result.push(this.tplData.class);
        }
        if (this.tplAttr && this.tplAttr.class) {
            result.push(this.tplAttr.class);
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
    getAttrId() {
        // return this.id || '';
        return `ui${this.serialId}`;
    }
    getAttrs() {
        var result = "";
        if (this.path && this.getTag() == "img") {
            result += "src='" + this.path + "'";
        }
        if (this.tplAttr) {
            result += Object.keys(this.tplAttr).map(key => {
                if (key != "data-model") {
                    return `${key}="${this.tplAttr[key]}"`;
                }
            })
        }
        return result;
    }
    // 开始节点
    getHtmlStart(_layoutType) {
        if (_layoutType == Common.TestLayout) {
            let modelName = this.modelName ? `md="${this.modelName}"` : '';
            return `<${this.getTag()} ${this.id} ${this.getAttrId()} ${modelName} ${this.getAttrClass()} ${this.getAttrs()}>${this.getContent()}`
        }
        return `<${this.getTag()} ${this.getAttrId()} ${this.getAttrClass()} ${this.getAttrs()}>${this.getContent()}`
    }
    // 闭合节点
    getHtmlEnd() {
        return this.tplData && this.tplData.isClosedTag ? '' : `</${this.getTag()}> `
    }
}
let htmlDomTree;

/**
 * 构建htmlDom树
 * @param {Object} parent 
 * @param {Json} data 
 */
let _buildTree = function (data, parent, cssDomMap) {
    let htmlNode = new HtmlDom(data, parent, cssDomMap[data.id]);
    // 构建树
    if (!parent) {
        htmlDomTree = htmlNode;
    } else {
        parent.children.push(htmlNode);
    }
    data.children.forEach(child => {
        _buildTree(child, htmlNode, cssDomMap);
    });
}

function process(data, cssDomMap) {
    htmlDomTree = null;
    _buildTree(data, htmlDomTree, cssDomMap);
    return htmlDomTree;
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