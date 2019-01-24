// dslTree数据及模板解析模块
const Common = require('../dsl2/dsl_common');
const DSLTreeTransfer = require('./render_parser_transfer')
const RENDER_TYPE = require('./render_types')
const Template = require("../template/template");
/**
 * DSL解析方法
 * @param {RenderData} dslTree 
 * @param {string=} platformType 解析类型: html(default),android,ios
 */
let parse = function (dslTree, platformType) {
    return DSLTreeProcessor.parseTree(dslTree, platformType);
}

const QNODE_TYPES = ['QImage', 'QText', 'QIcon', 'QShape', 'QWidget'];
const QCONTAINER_TYPES = ['QBody', 'QLayer'];
class DSLTreeProcessor {
    /**
     * 将json数据转化和模板数据结合输出
     * @param {Json} tree RenderData的json化格式 
     * @param {string=} platformType 解析类型: html(default),android,ios
     */
    static parseTree(tree, platformType = RENDER_TYPE.HTML) {
        tree.root = true;
        this.serialIndex = 1;
        walkout(tree, this._parseNode.bind(this, platformType));
        walkout(tree, nd => {
            this.addSerialId(nd);
        });
        
        return tree;
    }

    static _parseNode(platformType, pnode) {
        // 后面对解析做优化  
        // 返回上一层用把pnode当parent来处理
        if (!pnode.children || !pnode.children.length) return;

        pnode.children.forEach((node, index) => { 
            this._setTagName(node, platformType);
            let element = null;

            if (node.modelName == 'layer') {
                // 解析layer,
                element = this._parseLayerNode(node, platformType);
            }
            else if (node.type == Common.QWidget) {
                // 解析复合模型(组件模型, 元素模型)
                element = this._parseWidgetNode(node, platformType);
            }
            else if (node.type == Common.QLayer && node.modelName == 'cycle-01') {
                // 解析循环
                element = this._parseCycleNode(node, platformType);
            }
            else {
                // 解析基础节点
                element = this._parseBaseNode(node, platformType);
            }

            pnode.children[index] = element;
        });
    }

    static addSerialId(node) {
        node.serialId = this.serialIndex++;
    }

    //
    static _parseLayerNode(node, platformType) {
       // Layer不需要拿模板, 只需补充属性
       node.tplAttr = {};
       node.tplData = {};

       return node;
    }

    //
    static _parseWidgetNode(node, platformType) {
        let template = Template.getTemplate(node.modelName, platformType);
        // widget的解析, 从node节点上构建出数据
        this._handleWidgetNode(node);
        let element = DSLTreeTransfer.parse(template, node.children);
        this._assignValue(element, node);
        
        return element;
    }

    // 处理widget的数据
    static _handleWidgetNode(parentNode) {
        if (!parentNode.nodes || parentNode.nodes === {}) {
            return;
        }
        // widget的node是已key-value形式储存
        for (let key in parentNode.nodes) {
            let rdata = parentNode.nodes[key];
            parentNode.children.push(rdata);
            
            if (rdata.nodes && rdata.nodes['0']) {
                this._handleWidgetNode(rdata);
            }
        }
        // nodes已不再需要
        parentNode.nodes = null;
    }

    // 
    static _parseCycleNode(node, platformType) {
        let template = Template.getTemplate(node.modelName, platformType);
        // widget的解析, 从node节点上构建出数据
        this._handleCycleNode(node);
        let element = DSLTreeTransfer.parse(template, node.children);
        this._assignValue(element, node);

        return element;
    }

    // 处理循环数据结构
    static _handleCycleNode(parentNode) {
        if (!parentNode.nodes || parentNode.nodes === {}) {
            return;
        }

        // 循环的处理
        for (let key in parentNode.nodes) {
            let rdata = parentNode.nodes[key];

            // 解析出子节点
            if (rdata.type == Common.QLayer && rdata.modelName == 'layer') {
                // 解析layer,
                this._handleLayerNode(rdata);
            }
            else if (rdata.type == Common.QWidget) {
                // 解析复合模型(组件模型, 元素模型)
                this._handleWidgetNode(rdata);
            }
            else {
                // 解析基础节点
                this._handleBaseNode(rdata);
            }
        
            parentNode.children.push(rdata);
        }
        // nodes已不需要
        parentNode.nodes = null;
    }
    
    //
    static _parseBaseNode(node, platformType) {
        // 解析em1-m1到em1-m4系列的基础元素
        let template = Template.getTemplate(node.modelName, platformType);
        this._handleBaseNode(node);
        let element = DSLTreeTransfer.parse(template, [node]);
        this._assignValue(element, node);

        return element;
    }

    // 处理基础元素
    static _handleBaseNode(parentNode) {
        if (!parentNode.nodes || parentNode.nodes === {}) {
            // 不是符合元素就不处理了
            return;
        }

        for (let key in parentNode.nodes) {
            let rdata = parentNode.nodes[key];
            parentNode.children.push(rdata);
        }
        parentNode.nodes = null;
    }

    //
    static _setTagName(node, platformType) {
        if (!node.tagName) {
            switch (platformType) {
                case RENDER_TYPE.HTML:
                    node.tagName = 'div';
                    break;
                case RENDER_TYPE.ANDROID:
                    node.tagName = 'view';
                    break;
            }
        }
    }

    // 获取属性
    static _assignValue(destObj, obj) {
        destObj.id = obj.id;
        destObj.parentId = obj.parentId;
        destObj.modelName = obj.modelName;
        destObj.modelId = obj.modelId;
        destObj.type = obj.type;
        destObj.isCalculate = obj.isCalculate;
        destObj.abX = obj.abX;
        destObj.abY = obj.abY;
        destObj.abXops = obj.abXops;
        destObj.abYops = obj.abYops;
        destObj.width = obj.width;
        destObj.height = obj.height;
        destObj.styles = obj.styles;
        destObj.text = obj.text;
        destObj.path = obj.path;
        destObj.zIndex = obj.zIndex;
        destObj.similarId = obj.similarId;
        destObj.similarParentId = obj.similarParentId;
        
        // 约束的融合
        for (let key in obj.constraints) {
            destObj.constraints[key] = obj.constraints[key];
        }
    }
}

// 往外走
function walkout(node, handler) {
    if (!node.children || !node.children.length) return;
    node.children.map(n => {
        walkout(n, handler);
        handler(n);     // 处理节点
    });
    
    if (node.root) handler(node);
}


module.exports = {
    parse
}