let Store = require("./dsl_store.js");
let Model = require("./dsl_model.js");
let Logger = require("./logger.js");

/**
 * 模型序列化，按节点数低到高排序
 */
const mixCoefficient = 10000;

let modelList = Object.keys(Store.model).map(k => Store.model[k]).sort((n, p) => {
    return (n.textCount + n.imageCount + Math.abs(n.mixCount < 0 ? n.mixCount * mixCoefficient : n.mixCount) * 100) - (p.textCount + p.imageCount + Math.abs(p.mixCount < 0 ? p.mixCount * mixCoefficient : p.mixCount) * 100);
});

function fn(dom, parent) {
    if (dom.children) {
        // 从子孙节点开始遍历
        dom.children.forEach((child, i) => {
            fn(child, dom);
        });
    }
    modelList.some(model => {
        if (Model.is(model, dom, parent, Option, Config)) {
            Logger.log(`[pipe - model] ${model.name}\t fit Dom: "${dom.id}" `)
            Model.adjust(model, dom, parent, Option, Config)
            return true;
        }
    });
    return dom;
}

/**
 * 逻辑：组内左对齐，居中对齐为一列
 */
let Option = {
        deviationCoefficient: .05, // 偏差系数
    },
    Config = {}
module.exports = function (data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}