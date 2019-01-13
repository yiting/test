// dslTree数据及模板解析模块

const DSLTreeTransfer = require('./render_parser_transfer')
const RENDER_TYPE = require('./render_types')
const Template = require("../template/template");
/**
 * DSL解析方法
 * @param {Object} dslTree 
 * @param {string=} platformType 解析类型: html(default),android,ios
 */
let parse = function (dslTree, platformType) {
    return DSLTreeProcessor.parseTree(dslTree, platformType);
}
let serialIndex = 1;

const QNODE_TYPES = ['QImage', 'QText', 'QIcon', 'QShape', 'QWidget'];
const QCONTAINER_TYPES = ['QBody', 'QLayer'];
class DSLTreeProcessor {
    /**
     * 
     * @param {Object} dslTree 
     * @param {string=} platformType 解析类型: html(default),android,ios
     */
    static parseTree(tree, platformType = RENDER_TYPE.HTML) {
        let _tree = { children: [tree] }
        _tree.root = true;
        serialIndex = 1;
        // 遍历节点
        walkout(_tree, this._parseNode.bind(this, platformType));
        walkout(_tree, (node) => {
            this.addSerialId(node);
        })
        return _tree.children[0];
    }
    static _parseNode(platformType, pnode) {
        if (!pnode.children || !pnode.children.length) return;

        pnode.children.forEach((node, index) => {
            // if (node.modelName === 'cycle-01') debugger
            if (!node.modelName) return;
            let element = null;
            // _debuggerByid('4E0EC85E-AFB2-455C-9C17-FF91CE02A5EF',node);
            if (node.modelName === 'layer') {
                element = (~QNODE_TYPES.indexOf(node.type)) ? this._parseBgNode(node, platformType) : this._convertNode(node, platformType);
            } else {
                element = this._parseWidgetNode(node, platformType);
            }
            pnode.children[index] = element;
        })
    }

    /**
     * 解析背景节点
     */
    static _parseBgNode(node, platformType) {
        let element = this._convertNode(node, platformType);
        Object.assign(element, getAttr(node[0], ['zIndex', 'abX', 'abY', 'abXops', 'abYops', 'constraints', 'width', 'height', 'canLeftFlex', 'canRightFlex', 'path', 'styles']));
        return element;
    }

    /**
     * 解析模型节点
     */
    static _parseWidgetNode(node, platformType) {
        let template = Template.getTemplate(node.modelName, platformType);
        let element = DSLTreeTransfer.parse(template, node.children, platformType);
        Object.assign(element, getAttr(node, ['zIndex', 'abX', 'abY', 'abXops', 'abYops', 'constraints', 'width', 'height', 'canLeftFlex', 'canRightFlex', 'modelRef', 'modelName']));

        return element;
    }
    static addSerialId(node) {
        node.serialId = 'ts-' + serialIndex++;
    }
    // 将虚拟节点转化为平台容器节点
    static _convertNode(node, platformType) {
        let tagName = '';
        let {
            id = -1, beautyClass, width, height, abX = 0, abY = 0, abXops = 0, abYops = 0, constraints = {}, children = [], styles = {}, parentId = "", type = "", modelName = "", canLeftFlex = false, canRightFlex = false, isCalculate = false, tplAttr = {}, tplData = {}, text = "", path = ""
        } = node;
        switch (platformType) {
            case RENDER_TYPE.HTML:
                tagName = 'div';
                break;
            case RENDER_TYPE.ANDROID:
                tagName = 'view';
                break;
        }
        return {
            id,
            beautyClass,
            tagName,
            width,
            height,
            abX,
            abY,
            abXops,
            abYops,
            constraints,
            children,
            styles,
            parentId,
            type,
            modelName,
            canLeftFlex,
            canRightFlex,
            isCalculate,
            children,
            tplAttr,
            tplData,
            text,
            path
        }
    }
}
// 往外走
function walkout(node, handler) {
    if (!node.children || !node.children.length) return;
    node.children.map(n => {
        walkout(n, handler);
        handler(n); // 处理节点
    });
    if (node.root) handler(node);
}
// 遍历matchData
function walkModel(matchData, handler) {
    let structure = matchData.getMatchNode();
    // _debuggerByid('4E0EC85E-AFB2-455C-9C17-FF91CE02A5EFc',structure);
    for (let key in structure) {
        if (structure[key].constructor.name === 'MatchData') {
            structure[key] = walkModel(structure[key], handler) // 如果是个模型节点，则继续拆解
        }
    }
    return handler(matchData, structure); // 处理节点
}
function getAttr(node, keys, move = false) {
    let obj = {};
    if (!node) return obj;
    for (let key of keys) {
        if (isValue(node[key])) {
            obj[key] = node[key];
            if (move) delete node[key];
        }
    }
    return obj;
}
function isValue(val) {
    if (val === undefined || val === null || val === '') return false;
    if (typeof val === 'object') return !!Object.keys(val).length
    return true;
}
function _debuggerByid(id, pa) {
    let n = null;
    if (pa.type) {
        n = ~pa.id.indexOf(id);
    } else {
        n = Object.values(pa).find(n => ~n.id.indexOf(id))
    }
    if (n) debugger
}
module.exports = {
    parse
}
