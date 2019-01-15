const Logger = require('../logger')
const {walkin,walkout,hasComplexSytle,isCoincide,mergeStyle} = require('../designjson_utils');
let process = function(_document) {
    try {
        //虚拟树元素合并
        const processor = new _TransferProcessor(_document);
        processor.mix() // 合并元素属性
    } catch (err) {
        Logger.error('属性合并报错！');
    }

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
            if (node.type === 'QText' || node.type === 'QImage' || hasComplexSytle(node) || !isCoincide(node,parent)) return;
             // 父子重合时，将子元素属性合并到父元素上
            console.log(node.name,'合并到',parent.name)
            mergeStyle(parent,node);

            // if(node.path) parent.path = node.path;
            if (node.children && node.children.length) {
                let index = parent.children.indexOf(node);
                node.children.forEach((n,i) => {
                    _document.moveNode(n.id,parent,index + i);
                });
            }
            _document.removeNode(node.id,parent);
        })
    }
}
module.exports = process