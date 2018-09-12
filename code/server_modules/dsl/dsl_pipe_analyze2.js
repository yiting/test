import Store from "./dsl_store.js";
/**
 * functionName
 * @param  {Object} option 主流程传进来的参数
 * @return {Optimize}        返回原对象
 */
function analyze(obj, children) {

    let isLayout = Store.layout[obj.type];
    let o = {}
    o.id = obj.id
    o.name = obj.name
    o.abX = obj.abX
    o.abY = obj.abY
    o.x = obj.x
    o.y = obj.y
    o.width = obj.width
    o.height = obj.height
    o.area = o.width * o.height
    o.contentArea = 0;
    o.textCount = 0;
    o.size
    o.color
    // o.bgColor = obj.styles.backgroundColor
    if (obj.text) {
        obj.styles.texts.forEach((text) => {
            o.textCount += text.string.length;
        });
    }
    o.sentenceCount = obj.text ? 0 : 1;
    if (isLayout) {
        children.forEach((child) => {
            o.contentArea += (child.contentArea || 0);
            o.textCount += child.textCount;
            o.sentenceCount += child.sentenceCount;
        });
    } else {
        o.contentArea = o.area;

    }
    o.areaProportion = o.contentArea / o.area;
    return o;
}

function fn(json, res) {
    let arr = [];
    if (json.children) {
        json.children.forEach((child) => {
            arr.push(fn(child, res))
        });
    }
    let o = analyze(json, arr)
    res.push(o);
    return o;
}
let Config = {},
    Option = {}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    let res = []
    fn(data, res);
    return res;
}