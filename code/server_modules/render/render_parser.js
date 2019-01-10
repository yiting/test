// dslTree数据及模板解析模块
// const ID_CODE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@'.split('');
const DSLTreeTransfer = require('./render_parser_transfer')
const RENDER_TYPE = require('./render_types')
const Template = require("../template/template");
// 序列号ID
let serialId = 1;
/**
 * DSL解析方法
 * @param {Object} dslTree 
 * @param {string=} platformType 解析类型: html(default),android,ios
 */
let parse = function (dslTree, platformType) {
    serialId = 1;
    return DSLTreeProcessor.parseTree(dslTree, platformType);
}

const QNODE_TYPES = ['QImage', 'QText', 'QIcon', 'QShape', 'QWidget'];
const QCONTAINER_TYPES = ['QBody', 'QLayer'];
class DSLTreeProcessor {
    /**
     * 
     * @param {Object} dslTree 
     * @param {string=} platformType 解析类型: html(default),android,ios
     */
    static parseTree(dslTree, platformType = RENDER_TYPE.HTML) {
        let _tree = dslTree.getData();
        _tree.root = true;
        // 遍历节点
        walkout(_tree, this._parseNode.bind(this, platformType, dslTree));
        _tree = this._convertNode(_tree, platformType)
        delete _tree.root;
        return _tree;
    }
    static _parseNode(platformType, dslTree, pnode) {
        if (!pnode.children || !pnode.children.length) return;
        pnode.children.forEach((node, index) => {
            let element = null;
            // _debuggerByid('4E0EC85E-AFB2-455C-9C17-FF91CE02A5EF',node);
            if (node.modelName === 'layer') {
                element = (~QNODE_TYPES.indexOf(node.type)) ? this._parseBgNode(node, dslTree, platformType) : this._convertNode(node, platformType);
            } else {
                element = this._parseWidgetNode(node, dslTree, platformType);
            }
            pnode.children[index] = element;
        })
    }

    /**
     * 解析背景节点
     */
    static _parseBgNode(node, dslTree, platformType) {
        let matchData = dslTree.getModelData(node.id);
        let structure = matchData.getMatchNode();
        let element = this._convertNode(node, platformType);
        Object.assign(element, getAttr(structure[0], ['zIndex', 'abX', 'abY', 'abXops', 'abYops', 'constraints', 'width', 'height', 'canLeftFlex', 'canRightFlex', 'path', 'styles']));
        return element;
    }

    /**
     * 解析模型节点
     */
    static _parseWidgetNode(node, dslTree, platformType) {
        let matchData = dslTree.getModelData(node.id);
        return walkModel(matchData, function (mdata, structure) {
            let template = Template.getTemplate(mdata.modelName, platformType);
            let element = DSLTreeTransfer.parse(template, structure, platformType);
            Object.assign(element, getAttr(matchData, ['zIndex', 'abX', 'abY', 'abXops', 'abYops', 'constraints', 'width', 'height', 'canLeftFlex', 'canRightFlex']));

            return element;
        });
    }
    static transSerialId(node) {
        node.serialId = 'ts-' + serialId++;
        node.children && node.children.forEach(nd => this.transSerialId(nd));
    }
    static transId(node) {
        if (!~node.id.indexOf('vt') && !~node.id.indexOf('layer')) {
            node.id = DSLTreeProcessor.transToSID(node.id);
        }
        node.children && node.children.forEach(nd => DSLTreeProcessor.transId(nd));
    }
    static transToSID(guid) {
        const radix = ID_CODE.length;
        return guid.replace(/([a-f0-9]+)/img, function ($0, $1) {
            let arr = [];
            let qutient = parseInt($1, 16);
            do {
                let mod = qutient % radix;
                qutient = (qutient - mod) / radix;
                arr.unshift(ID_CODE[mod]);
            } while (qutient);
            return arr.join('')
        });
    }
    static transToGuid(sid) {
        const radix = ID_CODE.length;
        return sid.replace(/([a-z0-9@%]+)/img, function ($0, $1) {
            let len = $1.length,
                i = 0,
                origin_number = 0;
            while (i < len) {
                origin_number += Math.pow(radix, i++) * ID_CODE.indexOf($1.charAt(len - i) || 0);
            }
            return ('0000' + origin_number.toString(16)).slice(-4);
        })
    }
    static addPrefix(node) {
        if (node.id.indexOf('ts-') != 0) {
            node.id = 'ts-' + node.id;
        }
        var children = node.children;
        if (children) {
            for (var i = 0, ilen = children.length; i < ilen; i++) {
                this.addPrefix(children[i]);
            }
        }
    }
    // 将虚拟节点转化为平台容器节点
    static _convertNode(node, platformType) {
        let tagName = '';
        this.transSerialId(node);
        // this.addPrefix(node);
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
    if (!val) return false;
    if (typeof val === 'object') {
        if (Array.isArray(val)) return !!val.length
        else return !!Object.keys(val).length
    } else return true;
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