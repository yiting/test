const jsdom = require("jsdom");
const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
const extremType = {
    "Max":"Max",
    "Min":"Min"
}
const ATTR_TYPES = {
    FOR: ':for',
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
     * 入口：将xml模板与data数据结合在一起，生成目标json
     * @param {String} xml 
     * @param {Object} data
     */
    static parse(xml, data) {
        this.setXml(xml);
        this.process(xml,data);
        this.xml.isRoot = true;
        return this.convert(this.xml, data);
    };
    static process(xml,data) {
        let xml_repeat = this.xml.getElementsByTagName("repeat")[0];
        if (!xml_repeat) return;
        let xml_repeat_parent = xml_repeat.parentNode;
        let ref_template = xml_repeat.querySelector("[\\:ref]");
        xml_repeat_parent.removeChild(xml_repeat);
        data.forEach((item,index) => {
            ref_template.setAttribute(':ref',index);
            xml_repeat_parent.innerHTML += xml_repeat.innerHTML;
        })
    }
    static getNodeDataByModelRef(ref,data) {
        return data.find(d => d.modelRef === ref)
    }
    /**
     * 将xml模板与data数据结合在一起，生成目标json
     * 2.xml节点中“:”开头的属性保存在节点根的tplData里，其余属性放在tplAttr属性里
     * 3.当xml节点中遇到属性是":ref"时，将data里该属性的数据全保存到该xml节点下。
     * @param {String} xml 
     * @param {Object} data
     */
    static createNode(xml) {
        var obj = {};
        obj.id = this.guid();
        obj.tplAttr = {};
        obj.tplData = {};
        obj.tagName = xml.nodeName.toLowerCase();
        obj.modelName = "";
        obj.width = 0;
        obj.height = 0;
        obj.isCalculate = false;
        obj.constraints = {};
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
    static convert(xml, data) {
        if (xml.nodeType != 1) {
            return null;
        }
        let obj = this.createNode(xml);
        if (xml.attributes.length > 0) {
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                switch(attribute.nodeName) {
                    case ":ref": this.clone(data[attribute.nodeValue], obj); break;
                    case ":constraints": this.isJSON(attribute.nodeValue) && this.clone(JSON.parse(attribute.nodeValue), obj["constraints"]); break;
                    default : attribute.nodeName[0] === ':' ? obj["tplData"][attribute.nodeName.substring(1)] = attribute.nodeValue :  obj["tplAttr"][attribute.nodeName] = attribute.nodeValue;break;
                }
            }
        }
        if (xml.childNodes.length > 0) {
            var items = [];
            for (var i = 0; i < xml.childNodes.length; i++) {
                var node = xml.childNodes.item(i);
                var item = this.convert(node, data);
                if (item) {
                    items.push(item);
                }
            }
            if (items.length > 0) {
                obj.children = items;
            }
        }
        if(xml.isRoot){
            obj.modelName = data.modelName;
        } else {
            //父节点获取所有子节点的最边的四个角的值
            if(typeof(obj.abX) == "undefined"){
                obj.abX = this.getExtremValue(obj.children,"abX",extremType.Min,obj);
            }
            if(typeof(obj.abY) == "undefined"){
                obj.abY = this.getExtremValue(obj.children,"abY",extremType.Min,obj);
            }
            if(typeof(obj.abXops) == "undefined"){
                var childrenXops = this.getExtremValue(obj.children,"abXops",extremType.Max,obj);
                var selfXops = obj.abX+obj.width;
                obj.abXops = childrenXops>selfXops?childrenXops:selfXops;
            }
            if(typeof(obj.abYops) == "undefined"){
                var childrenYops = this.getExtremValue(obj.children,"abYops",extremType.Max,obj);
                var selfYops = obj.abY+obj.height;
                obj.abYops = childrenYops>selfYops?childrenYops:selfYops;
            }
            if(typeof(obj.canLeftFlex) == "undefined"){
                obj.canLeftFlex = data.canLeftFlex || false;
            }
            if(typeof(obj.canRightFlex) == "undefined"){
                obj.canRightFlex = data.canRightFlex || false;
            }
            obj.parentId = obj.parentId || obj.parent || '';
        }
        // obj.modelName = obj. modelName || data.modelName || '';
        return obj;
    };
    static clone(obj, destObj) {
        if (typeof obj !== "object") {
            return obj;
        } else {

            for (var key in obj) {
                if (key === 'tagName' && obj[key]) continue;
                let _key = key;
                if (key[0] === '_') {
                    _key = key.slice(1);
                    if (obj[_key] === undefined) continue;
                }
                destObj[_key] = obj[_key];
            }
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
        return 'ts-'+(++uuid);
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
module.exports = DSLTreeTransfer;