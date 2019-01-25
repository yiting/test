// 假设模板
const __tpl = `
<div class="${this.className}">
    <span $ref="0" style="background-image:url(${this.$ref[0].path})"></span>
    // $ref="绑定引用"
    // :src="绑定节点变量"
    <img $ref="1" :src="$ref[1].src"/>
    <div>
        <span @for> </span>
    </div>
</div>`

const _SYMBOL = {
    ref: '$ref',
    order: '@',
    var: ':',
    attr: '',
}
const TemplateData = require("./templateData");
const TemplateList = require("./templatelist");

class Template {
    constructor(tplData, engine) {
        this._tplData = tplData;
        this.$ref = renderData.nodes;
        this._engine = engine;
        /**
         * 主流程
         * */
        _parser();
    }
    // 模板解析
    _parser() {
        let that = this;
        let structure = this._engine.parse(this.tpl);
    }
    _traversal() {
        ~ function (structure) {
            structure.forEach(nd => {
                // 引用对象
                let refData = this.$ref[nd.attrs[_SYMBOL.ref]];
                let tplData = new TemplateData();
                delete nd.attrs[_SYMBOL.ref];

                Object.keys(nd.attrs).forEach(key => {
                    let value = nd.attrs[key];
                    if (~key.indexOf(_SYMBOL.order)) {
                        // 方法
                    } else if (~key.indexOf(_SYMBOL.var)) {
                        // 变量


                    } else {
                        // 普通属性
                    }
                })
                arguments.callee(structure.children)
            })
        }(structure)
    }
    parseOrder(funcName, refData) {
        if (this[funcName]) {
            this[funcName].call(this, refData, this._data);
        } else {
            console.error(`template function [${value}] doesn't exist!`)
        }
    }
    parseVar(varName, refData) {
        this.attrData
    }
    parseAttr(attrName, value) {
        this.attrData[attrName] = value;
    }
    for () {

    }
    static set(target, value) {

    }
}
let parse = function (data, engine) {
    let obj = new TemplateData(data);
    let tpl = TemplateList.some(n => n.toLowerCase() == (obj.modelName + '').toLowerCase());
    if (tpl) {
        tpl(obj, engine);
    }
    data.children.forEach(child => {
        obj.children.push(parse(child));
    });
}

module.exports = {
    Template,
    parse,
    XML_Engine
}

class XML_Engine {
    // xml结构解析
    static parse() {
        let rootTpl = [],
            curTpl = rootTpl,
            pen = [rootTpl];
        temp.match(/<.*?>/img).forEach(nd => {
            // 结束节点
            if (~nd.indexOf('</')) {
                let obj = pen.shift();
                curTpl = pen[0].children;
            } else {
                // 普通节点
                let obj = {
                    tag: Template._xmlTag(nd),
                    isCloseTag: Template._xmlIsCloseTag(nd),
                    attrs: Template._xmlAttr(nd),
                    children: []
                };
                curTpl.push(obj);
                if (!~nd.indexOf('/>')) {
                    // 如果非闭合节点
                    pen.unshift(obj);
                    curTpl = pen[0].children;
                }
            }
        });
        return rootTpl;
    }
    // 标签解析
    static _xmlTag(str) {
        return str.slice(1, str.indexOf(' '))
    }
    static _xmlIsCloseTag(str) {
        return ~str.indexOf('/>');
    }
    static _xmlAttr(str) {
        let obj = {};
        str.match(/[^\s]+=(\{.*?\}|[^\s]+)/img).forEach(val => {
            let m = val.split('='),
                key = m[0],
                value = m[1].slice(1, -1); //剔除前后双引号
            obj[key] = value;
        });
        return obj;
    }
}