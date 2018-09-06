const {walkin,walkout,hasCompleteSytle,isCoincide,mergeStyle} = require('./designjson_utils');
let process = function(_document) {
    //虚拟树元素合并
    const processor = new _TransferProcessor(_document);
    processor.mix() // 合并元素属性

}
// 树元素处理，包括属性合并，
class _TransferProcessor {
    constructor(_document) {
        this._document = _document;
    }
    mix() {
        const {_document} = this;
        walkout(_document._tree,node => {
            if(!node.parent) return;
            const parent = _document.getNode(node.parent);
            if (node.type === 'QImage' || hasCompleteSytle(node) || !isCoincide(node,parent)) return;
             // 父子重合时，将子元素属性合并到父元素上
            console.log(node.name,'合并到',parent.name)
            mergeStyle(parent,node);
            if (node.children && node.children.length) {
                node.children.forEach(n => {
                    _document.moveNode(n.id,parent)
                });
            }
            _document.removeNode(node.id,parent);
        })
    }
}
module.exports = process