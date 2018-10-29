let Dom = require("../dsl_dom.js");

/**
 * 文本
 * 规则：单行纯文本
 */
module.exports.name = 'TEXT';
module.exports.type = Dom.type.TEXT;
module.exports.textCount = 0;
module.exports.imageCount = 0;
module.exports.mixCount = 0;//-1，即为任意混合数
 module.exports.template = function() {

}
module.exports.is = function(dom, parent, option, config) {
    if ( dom.text && !dom.path && dom.lines == 1) {
        return true;
    }
}
module.exports.adjust=function(dom){

}