const jsdom = require("jsdom");
const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
const extremType = {
    "Max":"Max",
    "Min":"Min"
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
        this.xml.isRoot = true;
        return this.convert(this.xml, data);
    };
    /**
     * 将xml模板与data数据结合在一起，生成目标json
     * 2.xml节点中“:”开头的属性改成"_"开头，然后保存在节点根位置，其余属性放在_attr属性里
     * 3.当xml节点中遇到属性是":ref"时，将data里该属性的数据全保存到该xml节点下。
     * @param {String} xml 
     * @param {Object} data
     */
    static convert(xml, data) {
        if (xml.nodeType != 1) {
            return null;
        }
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
        var nodeValue = (xml.textContent || "").replace(/(\r|\n)/g, "").replace(/^\s+|\s+$/g, "");

        if (nodeValue && xml.childNodes.length == 1) {
            obj.text = nodeValue;
        }
        // if (xml.childNodes.length > 0) {
        //      //把for循环结构先处理
        //      for (var j = 0; j < xml.attributes.length; j++) {
        //         var attribute = xml.attributes.item(j);
        //         if(attribute.nodeName == ":repeat"){

        //         }
        //     }
        // }
        if (xml.attributes.length > 0) {
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                if(attribute.nodeName == ":constraints"){
                    if(this.isJSON(attribute.nodeValue) ){
                        
                        this.clone(JSON.parse(attribute.nodeValue), obj["constraints"]);
                    }
                    
                }else if (attribute.nodeName.indexOf(":") == 0 && attribute.nodeName != ":ref") {
                    obj["tplData"][attribute.nodeName.substring(1)] = attribute.nodeValue;
                } else if (attribute.nodeName == ":ref") {
                    // 复制data 到树里
                    this.clone(data[attribute.nodeValue], obj);
                } else {
                    obj["tplAttr"][attribute.nodeName] = attribute.nodeValue;
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
        //父节点获取所有子节点的最边的四个角的值
        if(typeof(obj.abX) == "undefined"){
            obj.abX = this.getExtremValue(obj.children,"abX",extremType.Min,obj);
        }
        if(typeof(obj.abY) == "undefined"){
            obj.abY = this.getExtremValue(obj.children,"abY",extremType.Min,obj);
        }
        if(typeof(obj.abXops) == "undefined"){
            obj.abXops = this.getExtremValue(obj.children,"abXops",extremType.Max,obj);
        }
        if(typeof(obj.abYops) == "undefined"){
            obj.abYops = this.getExtremValue(obj.children,"abYops",extremType.Max,obj);
        }
        if(typeof(obj.canLeftFlex) == "undefined"){
            obj.canLeftFlex = data.canLeftFlex || false;
        }
        if(typeof(obj.canRightFlex) == "undefined"){
            obj.canRightFlex = data.canRightFlex || false;
        }
        obj.parentId = obj.parentId || obj.parent || '';
        if(xml.isRoot){
            obj.modelName = data.modelName;
        }
        // obj.modelName = obj. modelName || data.modelName || '';
        return obj;
    };
    static clone(obj, destObj) {
        if (typeof obj !== "object") {
            return obj;
        } else {
            for (var i in obj) {
                destObj[i] = typeof obj[i] === "object" && obj[i] && !Array.isArray(obj[i])  ? this.clone(obj[i],{})  : obj[i];
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

// let xml =
// `
// <div id="em1-m1">
//     <h1 :ref="0" :class="title em1-m1" data-model="em1-m1" :contrains='{"LayoutSelfPosition":"Static","LayoutSelfHorizontal":"Left"}'></h1>
// </div>`;

// var data = {
//     "0": {
//         "id": "807D9AB8-E218-4365-BE0C-7A5B67C9EAEB",
//         "type": "QText",
//         "name": "看看即将上线的新游戏",
//         "width": 360,
//         "height": 36,
//         "x": 0,
//         "y": 0,
//         "abX": 28,
//         "abY": 28,
//         "constraints": {},
//         "text": "看看即将上线的新游戏",
//         "styles": {
//             "borderRadius": [0, 0, 0, 0],
//             "border": null,
//             "opacity": 1,
//             "rotation": 0,
//             "shadows": null,
//             "background": null,
//             "texts": [{
//                 "color": {
//                     "r": 0,
//                     "g": 0,
//                     "b": 0,
//                     "a": 1
//                 },
//                 "string": "看看即将上线的新游戏",
//                 "font": "PingFangSC-Medium",
//                 "size": 36
//             }],
//             "verticalAlign": 0,
//             "textAlign": 0,
//             "lineHeight": 36
//         },
//         "parent": "869FABE7-9504-43CF-B221-E5473D792822",
//         "children": [],
//         "childnum": 0,
//         "hasStyle": false,
//         "isMatched": true,
//         "modelName": "em1-m1"
//     }
// };
// let json = DSLTreeTransfer.parse(xml, data);
// // console.log(JSON.stringify(json)); //输出xml转换后的json

module.exports = DSLTreeTransfer;