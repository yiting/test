let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");
/**
 * 图片
 * 规则：拥有图片路径，没有子节点
 */
module.exports.template = function(dom) {
    return {
        tagStart:"img",
        tagEnd:"",
        attrObj:{
            "src":dom.path
        },
        contrains:{
            
        }
    }
}
module.exports.is = function(dom,parent,option,config) {
    if (!dom.text && dom.path && (!dom.children || dom.children.length == 0)) {
        dom.type = STORE.model.IMAGE;
        dom.contrains[CONTRAIN.LayoutFixedWidth] = true;
        dom.contrains[CONTRAIN.LayoutFixedHeight] = true;
        return true;
    }
}