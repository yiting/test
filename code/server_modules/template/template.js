// 假设模板
const __tpl = `./html/templatelist
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
const TemplateList = require("./html/templatelist");

class Template {
    constructor(renderData, parentTpl, engine) {
        // 节点引用
        this.$ref = renderData.nodes;
        // 渲染数据
        this._renderData = renderData;
        // 解析引擎
        this._engine = engine;
        // 模板内容结构
        this._structure = engine.parse(this.template);
        this._parentTpl = parentTpl;
        /**
         * 主流程
         * */
        // 遍历模板树
        this._rootData = this._traversal(this._structure, this._parentTpl, true)[0];
        // 遍历结构树
        renderData.children && renderData.children.forEach(childRenderData => {
            Template.parse(childRenderData, this._rootData, this._engine)
        });
    }
    getData() {
        return this._rootData;
    }
    get tpl() {
        return '<div></div>';
    }
    // 遍历模板树结构
    _traversal(structure, parentTpl, isRoot) {
        let arr = structure.map(nd => {
            // 构建对象
            tplData = this._parseObj(nd, isRoot);
            this._traversal(structure.children, tplData)
            return tplData;
        });
        if (parentTpl) {
            parentTpl.children.push(...arr);
        }
        return arr;
    }
    _parseObj(nd, isRoot) {
        let refIndex = nd.attrs[_SYMBOL.ref],
            renderData,
            tplData,
            tplData2
        // 根据条件获取引用对象
        if (refIndex) {
            renderData = this.$ref[refIndex];
        } else if (isRoot) {
            renderData = this._renderData;
        }
        // 构建模板节点
        tplData = new TemplateData(renderData);
        if (renderData.modelName) {
            // 如果有模型名称，则进入下一层模板
            tplData2 = Template.parse(renderData, null, this._engine);
            tplData = Template._assignObj(tplData2, tplData);
        }
        // 删除「引用」字段
        delete nd.attrs[_SYMBOL.ref];
        return tplData;
    }
    /**
     * 数据节点合并
     * 基础规则：大节点属性合并子节点属性
     * 约束合并规则：大节点【约束属性值】覆盖小节点【约束属性值】
     * 子节点合并规则：小节点加入大节点的子节点序列
     * 样式合并规则： 大节点【样式属性值】 覆盖小节点【样式属性值】
     */
    static _assignObj(target, source) {
        source.children.push(...target.children);
        // Object.assign(source.constraints, target.constraints);
        // Object.assign(source.styles,target.styles)
        return Object.assign({}, target, source);
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
    static getModelTemplate(modelName) {
        return TemplateList.some(n => n.name.toLowerCase() == (modelName + '').toLowerCase());
    }
    static parse(renderData, parentTpl, engine) {
        let ModelTpl = Template.getModelTemplate(renderData.modelName);
        let tplData = new ModelTpl(renderData, parentTpl, engine).getData();
        return tplData;
    }
}



module.exports = Template