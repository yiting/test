const Contrain = require('./dsl_constraints.js');
const Dom = require('./dsl_dom.js');

class Render extends Dom {
    constructor(node, parentNode) {
        super(node)
        this.children = node.children || [];
        this.parentNode = parentNode || null;
        this.SelfContrains = node.Contrains;
        this.ParentContrains = parentNode && parentNode.Contrains || {};
        this.prevNode = this.getPrevNode(true);
        this.nextNode = this.getNextNode(true);
    }
    getString() {
        return this._string;
    }
    /**
     * 找紧邻的上一个节点
     * @param {Boolean} overlookAbsolute 忽略绝对定位
     */
    getPrevNode(overlookAbsolute) {
        if (!this.parentNode) {
            return null;
        }
        let endIndex = this.parentNode.children.indexOf(this)
        return this.parentNode.children.find((child, i) => {
            return endIndex < i &&
                (!overlookAbsolute || child.contrains != Contrain.LayoutSelfPosition.Absolute)
        })
    }
    /**
     * 找紧邻的下一个节点
     * @param {Boolean} overlookAbsolute 忽略绝对定位
     */
    getNextNode(overlookAbsolute) {
        if (!this.parentNode) {
            return null;
        }
        let startIndex = this.parentNode.children.indexOf(this)
        return this.parentNode.children.find((child, i) => {
            return i > startIndex &&
                (!overlookAbsolute || child.contrains != Contrain.LayoutSelfPosition.Absolute)
        });
    }
    /**
     * 找祖父节点直到
     * @param {Function} logicFunction 逻辑方法
     * node.findParentUntil(parentNode=>parentNode.type=xx)
     */
    findParentUntil(logicFunction) {
        if (logicFunction(this.parentNode)) {
            return this.parentNode
        }
        return this.parentNode && this.parentNode.findParentUntil(logicFunction);
    }
}

module.exports = Render