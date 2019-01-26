// 假设模板
const __tpl = `
<div class="${this.className}">
    <span $ref="0" :style="{backgroundImage:"url("+path+")"}"></span>
    // $ref="绑定引用"
    // :src="绑定节点变量"
    <img $ref="1" :src="$ref[1].src"/>
    <div>
        <span @each> </span>
    </div>
</div>
`

const _SYMBOL = {
    ref: '$ref',
    order: '@',
    var: ':',
    attr: '',
}
const TemplateData = require("./templateData");
const TemplateList = require("./templatelist");

class _ {
    constructor(renderData, engine) {
        this.renderData = renderData;
        this.$ref = renderData.nodes;
        this._engine = engine;
        /**
         * 主流程
         * */
        let tree = this.parseTree(engine, this.tpl);
    }
    get tpl() {
        return '<div></div>';
    }
    // 构建树
    _parseTree(engine, tpl) {
        let structure = engine.parse(tpl);
        let trees = this._traversal(structure, true);
        return trees[0];
    }
    // 遍历模板树结构
    _traversal(structure, isRoot) {
        return structure.map(nd => {
            // 构建对象
            tplData = this._parseObj(nd, isRoot);
            this._traversal(structure.children)
            return tplData;
        });
    }
    _parseObj(nd, isRoot) {
        let refIndex = nd.attrs[_SYMBOL.ref],
            renderData = null,
            tplData = null
        // 根据条件获取引用对象
        if (refIndex) {
            renderData = this.$ref[refIndex];
        } else if (isRoot) {
            renderData = this.renderData;
        }

        if (renderData.modelName) {
            // 如果有模型名称，则进入下一层模板
            new TPL(renderData, this._engine)

        } else {
            tplData = new TemplateData(data);
        }
        // 否则，进入下一层遍历

        // 删除「引用」字段
        delete nd.attrs[_SYMBOL.ref];
        return tplData;
    }
    // 构架对象属性
    _parseProp(nd) {
        Object.keys(nd.attrs).forEach(key => {
            let value = nd.attrs[key];
            if (~key.indexOf(_SYMBOL.order)) {
                // 方法
                this._parseOrder(key.slice(1))
            } else if (~key.indexOf(_SYMBOL.var)) {
                // 变量
                this._parseVar(key.slice(1), value);
            } else {
                // 普通属性
                this._parseAttr(key, value);
            }
        });
    }
    // 编译命令
    _parseOrder(funcName, refData) {
        if (this[funcName]) {
            this[funcName].call(refData, this._data, this);
        } else {
            console.error(`template function [${value}] doesn't exist!`)
        }
    }
    // 编译变量属性
    _parseVar(varName, value) {
        let keys = Object.keys(this),
            values = Object.keys(this).map(n);
        let value = (new Function(...keys, `return ${value}`)).call(this, ...values);
        this.set(this, varName, value);
    }
    // 设置普通属性
    _parseAttr(attrName, value) {
        this.set(this, attrName, value)
    }
    each() {

    }
    set(target, prop, value) {
        if (typeof target.attrData[prop] == 'object') {
            if (typeof value != 'object') {
                return;
            }
            Object.assign(target.attrData[prop], value);
        } else {
            target.attrData[prop] = value;
        }
    }
}

let parse = function (renderData, engine) {
    let TPL = TemplateList.some(n => n.toLowerCase() == (renderData.modelName + '').toLowerCase());
    let obj = new TPL(renderData, engine);
    renderData.children.forEach(child => {
        obj.children.push(parse(child, engine));
    });
}

module.exports = {
    Template: _,
    parse,
}