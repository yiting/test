const Logger = require('../logger')
const {walkin,walkout,hasComplexSytle,isCoincide,mergeStyle} = require('../designjson_utils');
const {
    QDocument, 
    QLayer, 
    QBody, 
    QImage, 
    QText, 
    QShape,
    QMask, 
    QSlice
} = require('../designjson_node');
let process = function(_document) {
    try {
        //虚拟树元素合并
        const processor = new _TransferProcessor(_document);
        processor.mix() // 合并元素属性
        processor.reCompute() // 属性重计算
    } catch (err) {
        Logger.error('属性重组报错！');
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
            if (node.type === QText.name || node.type === QImage.name || hasComplexSytle(node) || !isCoincide(node,parent)) return;
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
    reCompute() {
        const {_document} = this;
        walkout(_document._tree,node => {
            if (node.type === QText.name) this._cleanLineHeight(node);
        })
    }
        /**
     * 行高清洗
     * @param {Dom} dom dom
     * @param {Dom} lineHeightCoe 行高系数，如1.2
     */
    _cleanLineHeight(dom, lineHeightCoe=1.2) {
        if (!dom.lines && dom.text && dom.styles.texts) {
            // fontSize
            let maxSize = Number.NEGATIVE_INFINITY,
                minSize = Number.POSITIVE_INFINITY;
            (dom.texts || dom.styles.texts).forEach((s) => {
                maxSize = s.size > maxSize ? s.size : maxSize;
                minSize = s.size < minSize ? s.size : minSize;
            });
            dom.styles.maxSize = Math.round(maxSize);
            dom.styles.minSize = Math.round(minSize);
            // 当前真实行高
            const lineHeight = dom.styles.lineHeight || maxSize * 1.4;
            // 目标行高
            const targetLineHeight = maxSize * lineHeightCoe;
            // 根据高度处以行高，如果多行，则不处理行高
            if (dom.height / lineHeight > 1.1) {
                dom.lines = Math.round(dom.height / lineHeight);
                return;
            }
            dom.lines = 1;
            // 当前行高差
            let dir = (lineHeight - maxSize);
            dom.textHeight = Math.round(maxSize);
            dom.textAbY = Math.round(dom.abY + dir / 2);
            // 设置目标行高、高度、Y
            let dif = Math.floor((targetLineHeight - dom.height) / 2);
            dom.height = dom.styles.lineHeight = Math.round(targetLineHeight);
            dom.y -= dif;
            dom.abY -= dif;
        }
    }

}
module.exports = process