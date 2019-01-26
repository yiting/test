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
const XML_Engine = require('./XML_Engine');

class Template {
    constructor(renderData, parentTpl, templateList) {
        // 节点引用
        this.$ref = renderData.nodes;
        // 渲染数据
        this._renderData = renderData;
        // 解析引擎
        this._engine = XML_Engine;
        // 模板内容结构
        this._structure = this._engine.parse(this.template);
        this._parentTpl = parentTpl;
        this._templateList = templateList;
        /**
         * 主流程
         * */
        // 遍历模板树
        this._rootData = this._traversal(this._structure, this._parentTpl, true)[0];
        // 遍历结构树
        renderData.children && renderData.children.forEach(childRenderData => {
            Template.parse(childRenderData, this._rootData, this._templateList)
        });
    }
    getData() {
        return this._rootData;
    }
    get name() {
        return 'layer';
    }
    get template() {
        return '<div></div>';
    }
    // 遍历模板树结构
    _traversal(structure, parentTpl, isRoot) {
        let arr = structure.map(nd => {
            // 构建对象
            let tplData = this._parseObj(nd, isRoot);
            this._traversal(nd.children, tplData)
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
        if (this.$ref && refIndex) {
            renderData = this.$ref[refIndex];
        } else if (isRoot) {
            renderData = this._renderData;
        }
        // 构建模板节点
        tplData = new TemplateData(renderData);
        if (!isRoot && renderData && renderData.modelName && renderData.nodes && renderData.nodes['1']) {
            // 如果子节点有模型名称，则进入下一层模板
            tplData2 = Template.parse(renderData, null, this._templateList);
            tplData = Template._assignObj(tplData2, tplData);
        }
        // 删除「引用」字段
        delete nd.attrs[_SYMBOL.ref];
        // 赋值
        this._parseProp(tplData, nd);
        return tplData;
    }
    /**
     * 数据节点合并
     * 基础规则：大节点属性合并子节点属性
     * 约束合并规则：大节点【约束属性值】覆盖小节点【约束属性值】
     * 子节点合并规则：小节点加入大节点的子节点序列
     * 样式合并规则： 大节点【样式属性值】 覆盖小节点【样式属性值】
     */
    static _assignObj(target = {}, source = {}) {
        source.children.push(...target.children);
        // Object.assign(source.constraints, target.constraints);
        // Object.assign(source.styles,target.styles)
        return Object.assign({}, target, source);
    }
    // 构建对象属性
    _parseProp(refData, nd) {
        Object.keys(nd.attrs).forEach(key => {
            let value = nd.attrs[key];
            if (~key.indexOf(_SYMBOL.order)) {
                // 方法
                this._parseOrder(refData, key.slice(1), value);
            } else if (~key.indexOf(_SYMBOL.var)) {
                // 变量
                this._parseVar(refData, key.slice(1), value);
            } else {
                // 普通属性
                this._parseAttr(refData, key, value);
            }
        });
        refData.tag = nd.tag;
        refData.isCloseTag = nd.isCloseTag;
    }
    // 编译命令
    _parseOrder(refData, funcName) {
        if (this[funcName]) {
            this[funcName].call(this, refData);
        } else {
            console.error(`template function [${funcName}] doesn't exist!`)
        }
    }
    // 编译变量属性
    _parseVar(refData, varName, value) {
        let newValue = null;
        if (~value.indexOf('()')) {
            let funcName = value.slice(0, -2);
            // 如果是函数
            if (this[funcName]) {
                try {
                    newValue = this[funcName].call(this, refData);
                } catch (e) {
                    console.error(`template function [${funcName}] error!`);
                    return;
                }
            } else {
                console.error(`template function [${funcName}] doesn't exist!`);
                return;
            }
        } else {
            let keys = Object.keys(refData),
                args = Object.keys(refData).map(key => refData[key]);
            try {
                newValue = (new Function(...keys, `return ${value}`)).call(this, ...args);
            } catch (e) {
                console.log(varName, value)
                console.error(e);
            }
        }
        this.set(refData, varName, newValue);
    }
    // 设置普通属性
    _parseAttr(refData, attrName, value) {
        this.set(refData, attrName, value)
    }
    each() {

    }
    set(refData, prop, value) {
        let target = Object.keys(refData).includes(prop) ? refData : refData.tplAttr;

        if (typeof target[prop] == 'object') {
            if (typeof value != 'object') {
                return;
            }
            Object.assign(target[prop], value);
        } else {
            target[prop] = value;
        }
    }
    static getModelTemplate(TemplateList, modelName) {
        return TemplateList.find(n => {
            return n.name.toLowerCase() == (modelName + '').toLowerCase().replace(/-/img, '');
        });
    }
    static parse(renderData, parentTpl, TemplateList) {
        let ModelTpl = Template.getModelTemplate(TemplateList, renderData.modelName) || Template;
        let tplData = new ModelTpl(renderData, parentTpl, TemplateList).getData();
        return tplData;
    }
}

module.exports = Template