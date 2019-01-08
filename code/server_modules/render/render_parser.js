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

const QNODE_TYPES = ['QImage','QText','QIcon','QShape','QWidget'];
const QCONTAINER_TYPES = ['QBody','QLayer'];
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
    static _parseNode(platformType,dslTree,pnode) { 
        if(!pnode.children || !pnode.children.length) return;
        pnode.children.forEach((node,index) => {
            let element = (node.modelName != 'layer') ? this._parseWidgetNode(node,dslTree,platformType) : this._convertNode(node,platformType);
            pnode.children[index] = element;
        })
    }

    /**
     * 解析模型节点
     */
    static _parseWidgetNode(node, dslTree, platformType) {
        // let styles = {};
        // // 单节点才获取样式,否则node上没有样式
        // if (jsonNode['0'] && !jsonNode['1']) {
        //     styles = jsonNode['0'].styles;
        // }

        let matchData = dslTree.getModelData(node.id);
        return walkModel(matchData,function(mdata,structure) {
            let template = Template.getTemplate(mdata.modelName,platformType);
            let element = DSLTreeTransfer.parse(template, structure,platformType);
            Object.assign(element,getAttr(matchData,['zIndex','abX','abY','abXops','abYops','constraints','width','height','canLeftFlex','canRightFlex']));
            
            return element;
        });
    }
    static addPrefix(node) {
        if (node.id.indexOf('ts-') != 0) {
            node.id = 'ts-' + node.id;
        }
        var children = node.children;
        if (children) {
            for (var i = 0, ilen = children.length; i < ilen; i++) {
                if (children[i].id.indexOf('ts-') != 0) {
                    children[i].id = 'ts-' + children[i].id;
                }
                if (children[i]['children'] && children[i]['children'].length > 0) {
                    this.addPrefix(children[i]);
                }
            }
        }
    }
    // 将虚拟节点转化为平台容器节点
    static _convertNode(node, platformType) {
        let tagName = '';
        this.addPrefix(node);
        let {
            id = -1, width, height, abX = 0, abY = 0, abXops = 0, abYops = 0, constraints = {}, children = [], styles = {}, parentId = "", type = "", modelName = "", canLeftFlex = false, canRightFlex = false, isCalculate = false, tplAttr = {}, tplData = {}, text = "", path = ""
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
    node.beautyClass = "a";
    if (!node.children || !node.children.length) return;
    node.children.map(n => {
        walkout(n, handler);
        handler(n); // 处理节点
    });
    if (node.root) handler(node);
}
// 遍历matchData
function walkModel(matchData,handler) {
    let structure = matchData.getMatchNode();
    // _debuggerByid('B445DFC5-B0F5-48B4-A679-A5A4CDFA7D9F',structure);
    for (let key in structure) {
        if (structure[key].constructor.name === 'MatchData') {
            structure[key] = walkModel(structure[key],handler) // 如果是个模型节点，则继续拆解
        }
    }
    return handler(matchData,structure); // 处理节点
}
function getAttr(node,keys,move = false) {
    let obj = {};
    if (!node) return obj;
    for (let key of keys) {
        if (isValue(node[key])) {
            obj[key] = node[key];
            if(move) delete node[key];
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
function _debuggerByid(id,structure) {
    let n = Object.values(structure).find(n => ~n.id.indexOf(id))
    if (n) debugger
}
module.exports = {
    parse
}
