const Contrain = require('../../dsl2/dsl_constraints');
const Dom = require('../../dsl2/dsl_dom');
const fs = require('fs');
let htmlTpl;

class HtmlDom {
    constructor(node, parentNode) {
        // super(node)
        this.children = node.children || [];
        this.parentNode = parentNode || null;
        this.id = node.id;
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
        this.beautyClass = node.beautyClass || "";
    }
    get x() {
        return this.parent ? (this.abX - this.parent.abX) : this.abX
    }
    get y() {
        return this.parent ? (this.abY - this.parent.abY) : this.abY
    }
    getAttrClass() {
        var result = '';
        if (this.tplData && this.tplData.class) {
            result += this.tplData.class + ' ';
        }
        if (this.tplAttr && this.tplAttr.class) {
            result += this.tplAttr.class + ' ';
        }
        // if(this.id){
        //     result += this.id + ' ';
        // }
        if(this.beautyClass){
            result += this.beautyClass + ' ';
        }
        if (result.length > 0) {
            result = result.substring(0, result.length - 1);
        }
        if (result != '') {
            return `class="${result}"`;
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
        return this.id || '';
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
    getHtmlStart() {
        return `<${this.getTag()} ${this.getAttrClass()} ${this.getAttrs()}>${this.getContent()}`
    }
    // 闭合节点
    getHtmlEnd() {
        return this.tplData && this.tplData.isClosedTag ? '' : `</${this.getTag()}> `
    }
}

function process(data) {
    let html = '';
    let render = new HtmlDom(data);
    // 遍历循环
    html += render.getHtmlStart();
    if (data.children) {
        data.children.forEach(child => {
            html += process(child);
        });
    }
    html += render.getHtmlEnd();
    return html;
}

function getHtmlTpl() {
    if (!htmlTpl) {
        htmlTpl = fs.readFileSync("./code/server_modules/render/tpl.html", "utf-8");
    }
    return htmlTpl;
}

module.exports = {
    HtmlDom,
    process,
    getHtmlTpl
}