const Utils = require('../dsl_utils.js');
const Model = require('../dsl_model.js');

class LayoutSort extends Model.LayoutModel {
    constructor(modelType) {
        super(modelType);
    }

    /**
     * 对传进来的模型数组进行处理
     * @param {TreeNode} parent 树节点
     * @param {Array} nodes 树节点数组
     * @param {Array} models 对应的模型数组
     * @param {Int} layoutType 布局的类型
     */
    handle(parent, nodes, models, layoutType) {
        if (this._modelType != layoutType) {
            return;
        }

        // if (this._isVerticalLayout(nodes)) {
        if (Utils.isHorizontal(nodes)) {
            this._sort(nodes, 'abX');
        } else {
            this._sort(nodes, 'abY');
        }
    }

    // 筛选前排序
    _sort(nodes, opt) {
        nodes.sort((a, b) => {
            return a[opt] - b[opt];
        })
    }
}

module.exports = new LayoutSort();