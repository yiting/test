const jsdom = require("jsdom");
const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
const extremType = {
    "Max":"Max",
    "Min":"Min"
}
const ATTR_TYPES = {
    REF: ':ref',
    CONSTRAINTS: ':constraints'
}
let uuid = 1;
class DSLTreeTransfer {

    static getExtremValue(childrenNodes,prop,extremType,parentNode){
        var result = 0;
        if(prop == "abX" || prop == "abY"){
            if(childrenNodes && childrenNodes.length>0){
                for(var i=0,ilen=childrenNodes.length;i<ilen;i++){
                    if(childrenNodes[i][prop]<result || result == 0){
                        result = childrenNodes[i][prop];
                    }
                }
            }
        }else if(prop == "abXops"){
            if(childrenNodes && childrenNodes.length>0){
                for(var i=0,ilen=childrenNodes.length;i<ilen;i++){
                    if(childrenNodes[i][prop]>result){
                        result = childrenNodes[i][prop];
                    }
                }
            }else{
                result = parentNode["abX"] + parentNode["width"];
            }
        }else if(prop == "abYops"){
            if(childrenNodes && childrenNodes.length>0){
                for(var i=0,ilen=childrenNodes.length;i<ilen;i++){
                    if(childrenNodes[i][prop]>result){
                        result = childrenNodes[i][prop];
                    }
                }
            }else{
                result = parentNode["abY"] + parentNode["height"];
            }
        }
        return result;
    }
    static setXml(xml) {
        if (xml && typeof xml == "string") {
            this.xml = dom.window.document.createElement("div");
            this.xml.innerHTML = xml;
            this.xml = this.xml.getElementsByTagName("*")[0];
        } else if (typeof xml == "object") {
            this.xml = xml;
        }
    }
    static getXml() {
        return this.xml;
    };
    /**
     * 入口：将xml模板与dslNodes数据结合在一起，生成目标json
     * @param {String} xml 
     * @param {Object} dslNodes
     */
    static parse(xml, dslNodes) {
        this.setXml(xml);
        this.process(dslNodes);
        this.xml.isRoot = true;
        this.modelId = dslNodes[0].modelId;
        return this.convert(this.xml, dslNodes);
    };
    static process(dslNodes) {
        let xml_repeat = this.xml.getElementsByTagName("repeat")[0];
        if (!xml_repeat) return;
        let xml_repeat_parent = xml_repeat.parentNode;
        let ref_template = xml_repeat.querySelector("[\\:ref]");
        xml_repeat_parent.removeChild(xml_repeat);
        dslNodes.forEach((item,index) => {
            ref_template.setAttribute(':ref',index);
            xml_repeat_parent.innerHTML += xml_repeat.innerHTML;
        })
    }
    static getNodeDataByModelRef(ref,dslNodes) {
        return dslNodes.find(d => d.modelRef === ref)
    }
    /**
     * 将xml模板与dslNodes数据结合在一起，生成目标json
     * 2.xml节点中“:”开头的属性保存在节点根的tplData里，其余属性放在tplAttr属性里
     * 3.当xml节点中遇到属性是":ref"时，将dslNodes里该属性的数据全保存到该xml节点下。
     * @param {String} xml 
     * @param {Object} ddslNodesata
     */
    static createNode(xml) {
        var obj = {};
        obj.id = this.guid();
        obj.tplAttr = {};
        obj.tplData = {};
        obj.tagName = xml.nodeName.toLowerCase();
        obj.modelName = "";
        obj.modelId = this.modelId;
        obj.width = 0;
        obj.height = 0;
        obj.isCalculate = false;
        obj.children = [];
        obj.styles = {};
        obj.text = "";
        obj.path = "";
        obj.constraints = {};
        var nodeValue = (xml.textContent || "").replace(/(\r|\n)/g, "").replace(/^\s+|\s+$/g, "");

        if (nodeValue && xml.childNodes.length == 1) {
            obj.text = nodeValue;
        }
        return obj;
    }
    static convert(xml, dslNodes) {
        if (xml.nodeType != 1) {
            return null;
        }
        let node = this.createNode(xml);
        if (xml.attributes.length > 0) {
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                switch(attribute.nodeName) {
                    case ":ref": {this.clone(this._getRenderDataByRef(attribute.nodeValue,dslNodes), node);delete node['modelRef']} break;
                    case ":constraints": this.isJSON(attribute.nodeValue) && this.mergeAttr(JSON.parse(attribute.nodeValue), node["constraints"]); break;
                    default : attribute.nodeName[0] === ':' ? node["tplData"][attribute.nodeName.substring(1)] = attribute.nodeValue :  node["tplAttr"][attribute.nodeName] = attribute.nodeValue;break;
                }
            }
        }
        if (xml.childNodes.length > 0) {
            let items = [];
            for (let i = 0; i < xml.childNodes.length; i++) {
                let x = xml.childNodes.item(i);
                let item = this.convert(x, dslNodes);
                if (item) {
                    items.push(item);
                }
            }
            if (items.length > 0) {
                node.children = items;
            }
        }
        if(xml.isRoot){
            node.modelName = dslNodes.modelName;
        } else {
            //父节点获取所有子节点的最边的四个角的值
            if(typeof(node.abX) == "undefined"){
                node.abX = this.getExtremValue(node.children,"abX",extremType.Min,node);
            }
            if(typeof(node.abY) == "undefined"){
                node.abY = this.getExtremValue(node.children,"abY",extremType.Min,node);
            }
            if(typeof(node.abXops) == "undefined"){
                var childrenXops = this.getExtremValue(node.children,"abXops",extremType.Max,node);
                var selfXops = node.abX+node.width;
                node.abXops = childrenXops>selfXops?childrenXops:selfXops;
            }
            if(typeof(node.abYops) == "undefined"){
                var childrenYops = this.getExtremValue(node.children,"abYops",extremType.Max,node);
                var selfYops = node.abY+node.height;
                node.abYops = childrenYops>selfYops?childrenYops:selfYops;
            }
            if(typeof(node.canLeftFlex) == "undefined"){
                node.canLeftFlex = null;
            }
            if(typeof(node.canRightFlex) == "undefined"){
                node.canRightFlex = null;
            }
            node.parentId = node.parentId || node.parent || '';
        }
        // node.modelName = node. modelName || data.modelName || '';
        return node;
    };
    static mergeAttr(obj,targetObj) {
        Object.assign(targetObj,obj);
    }
    static _getRenderDataByRef(ref,dslNodes) {
        try {
            return dslNodes.find(n => n.modelRef === ref);
        } catch (error) {
            throw dslNodes
        }
    }
    static clone(obj, destObj) {
        if (typeof obj !== "object") {
            return obj;
        } else {
            Object.assign(destObj,getAttr(obj,['zIndex','similarId','abX','abY','abXops','abYops','styles','constraints','children','width','height','canLeftFlex','canRightFlex','modelRef','modelName','text','path']));
            // for (let key in obj) {
            //     if (key === 'tagName' && obj[key]) continue;
            //     destObj[key] = obj[key];
            // }
        }
        return destObj;
    }
    static isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }
    
            } catch(e) {
                // console.log('error：'+str+'!!!'+e);
                return false;
            }
        }
        console.log('It is not a string!')
    }
    static guid() {
        return ++uuid + '';
    }
}
function walkout(xml, handler) {
    if (!xml.childNodes || !node.childNodes.length) return;
    xml.childNodes.map(x => {
        walkout(x, handler);
        handler(x); // 处理节点
    });
    if (xml.root) handler(xml);
}
function getAttr(node,keys = null,move = false) {
    let obj = {};
    if (!node) return obj;
    for (let key of keys || Object.keys(node)) {
        if (isValue(node[key])) {
            obj[key] = node[key];
            if(move) delete node[key];
        }
    }
    return obj;
}
function isValue(val) {
    if (val === undefined || val === null || val === '') return false;
    if (typeof val === 'object') return !!Object.keys(val).length
    return true;
}
module.exports = DSLTreeTransfer;