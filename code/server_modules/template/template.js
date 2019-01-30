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
    each: '$each',
    order: '@',
    var: ':',
    attr: '',
}
const TemplateData = require("./templateData");
const XML_Engine = require('./XML_Engine');

const QLog = require("../log/qlog");
const Loger = QLog.getInstance(QLog.moduleData.render);

class Template {
    constructor(renderData, parentTpl, templateList) {
        // 节点引用
        this.$ref = renderData.nodes || {};
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
        let arr = [];
        for (let index = 0; index < structure.length; index++) {
            let nd = structure[index];
            // 预处理
            let res = this._preProp(nd, structure);
            if (res === null) {
                continue;
            }

            // 构建对象
            let tplData = this._parseObj(nd, parentTpl, isRoot);
            // 赋值
            this._parseProp(tplData, nd, parentTpl);
            // 遍历子节点
            this._traversal(nd.children, tplData)
            // 如果为模板虚拟节点，则自动构建坐标
            if (!tplData.type) {
                tplData.resize();
                tplData.modelName = null;
            }
            arr.push(tplData);
        };
        if (parentTpl) {
            parentTpl.children.push(...arr);
        }
        return arr;
    }

    _preProp(nd, structure) {
        if (Object.keys(nd.attrs).includes(_SYMBOL.each)) {
            delete nd.attrs[_SYMBOL.each];
            Object.keys(this._renderData.nodes).forEach(index => {
                let newAttr = Object.assign({}, nd.attrs);
                let newNd = Object.assign({}, nd)
                newNd.attrs = newAttr;
                newNd.attrs.$ref = index;
                structure.push(newNd);
            });
            return null;
        }
    }
    // 根据模板节点，构建数据节点
    _parseObj(nd, parentTpl, isRoot) {
        let refIndex = nd.attrs[_SYMBOL.ref],
            renderData,
            tplData,
            tplDataChild
        // 删除「引用」字段
        delete nd.attrs[_SYMBOL.ref];

        // 如果模型根节点为引用，则把引用节点信息覆盖根节点
        if (isRoot && this.$ref[refIndex]) {
            this._renderData.id = this.$ref[refIndex].id;
        }
        // 根据条件获取引用对象
        // 如果有引用，则用引用数据
        if (this.$ref && this.$ref[refIndex]) {
            renderData = this.$ref[refIndex];
            // 如果无引用且为模型根节点，则用模型数据
        } else if (isRoot) {
            renderData = this._renderData;
        }
        // 构建模板节点
        tplData = new TemplateData(renderData, parentTpl, this._renderData);
        // console.log(tplData.id, tplData.parentId)
        tplData.modelId = this._renderData.id;
        tplData.parentId = parentTpl && parentTpl.id;
        if (!isRoot && renderData && renderData.modelName && renderData.nodes && renderData.nodes['1']) {
            // 如果子节点有模型名称，则进入下一层模板
            tplDataChild = Template.parse(renderData, null, this._templateList);
            tplData = Template._assignObj(tplData, tplDataChild);
        }
        // 遍历结构树
        if (renderData && renderData.children) {
            renderData.children.forEach(childRenderData => {
                Template.parse(childRenderData, tplData, this._templateList)
            });
        }
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
        target.children.push(...source.children);
        target.id = source.id;
        target.constraints = Object.assign(source.constraints, target.constraints)
        target.styles = Object.assign(source.styles, target.styles)
        // Object.assign(source.constraints, target.constraints);
        // Object.assign(source.styles,target.styles)
        return target;
    }
    // 构建对象属性
    _parseProp(refData, nd) {
        refData.tagName = nd.tagName;
        refData.isClosedTag = nd.isClosedTag;
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
    }
    // 编译命令
    _parseOrder(refData, funcName, value) {
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
                    console.error(`template function [${funcName}] error: ${e}`);
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
                console.error(e);
            }
        }
        this.set(refData, varName, newValue);
    }
    // 设置普通属性
    _parseAttr(refData, attrName, value) {
        this.set(refData, attrName, value)
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
        try {
            let ModelTpl = Template.getModelTemplate(TemplateList, renderData.modelName) || Template;
            let tplData = new ModelTpl(renderData, parentTpl, TemplateList).getData();
            return tplData;
        } catch (e) {
            Loger.error(`template.js [parse] params[renderData.id:${renderData.id},parentTpl:${parentTpl}]`)
        }
    }
}

module.exports = Template