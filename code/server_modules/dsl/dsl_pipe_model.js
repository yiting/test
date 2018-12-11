const Store = require("./dsl_store.js");
const Model = require("./dsl_model.js");
const Logger = require('./logger');
const Common = require('./dsl_common');

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
        // 判断是否符合模型
        if (Model.is(model, dom, parent, Config)) {
            Logger.debug(`[pipe - model] ${model.name}\t fit Dom: "${dom.id}" `)
            // 符合模型，做模型调整
            Model.adjust(model, dom, parent, Config)
            // 找到同组相似模型组
            let targetGroup = similarModelGroups.find(arr => {
                return arr[0].model == dom.model && model.isSimilar && model.isSimilar(arr[0], dom, Config)
            });
            if (!targetGroup) {
                dom.similarMarkId = similarMarkIndex++;
                similarModelGroups.push([dom]);
            } else {
                targetGroup.push(dom);
                if (model.canShareStyle) {
                    // 如果可复用，单元素不能共用样式
                    dom.styles = targetGroup[0].styles;
                }
                dom.similarMarkId = targetGroup[0].similarMarkId;
            }
            return true;
        }
    });
    return dom;
}

/**
 * 逻辑：组内左对齐，居中对齐为一列
 */
let Config = {},
    similarMarkIndex = 0,
    similarModelGroups = []
module.exports = function (data) {
    Config = this.attachment.config;
    similarMarkIndex = 0;
    similarModelGroups = [];
    let dom = fn(data, null);
    return dom;
}