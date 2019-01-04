const Render = require('./dsl_render.js');
class HtmlRender extends Render {
    constructor(node, parentNode) {
        super(node, parentNode);
        this._tag = node.type|| 'div';
        this._isClosedTag = !!node._isClosedTag;
        this._class = node._class || '';
        this._attrs = node._attrs || {};
        this._text = node.text || '';
    }
    getAttrClass() {
        return this._class ? `class="${this._class}"` : '';
    }
    getTag() {
        return this._tag;
    }
    getContent() {
        return this._text || '';
    }
    getAttrId() {
        return `ts-${this.similarMarkId || this.id}`
    }
    getAttrs() {
        return Object.keys(this._attrs).map(key => {
            return `${key}=\"${this._attrs[key]}\"`;
        })
    }
    // 开始节点
    getHtmlStart() {
        return `<${this.getTag()} ${this.getAttrId()} ${this.getAttrClass()} ${this.getAttrs()}>${this.getContent()}`
    }
    // 闭合节点
    getHtmlEnd() {
        return this._isClosedTag ? '' : `</${this.getTag()}> `
    }
    static getString(dom) {
        let html = '';
        let render = new HtmlRender(dom);
        // 遍历循环
        html += render.getHtmlStart();
        if (render.children.forEach) {
            render.children.forEach(child => {
                html += HtmlRender.getString(child)
            });
        }
        html += render.getHtmlEnd();
        return html;
    }
}

module.exports = HtmlRender;