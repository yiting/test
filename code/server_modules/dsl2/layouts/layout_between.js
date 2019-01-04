// LayoutFlex下两端对齐, 中间等分修正

const Common = require('../dsl_common.js');
const Model = require('../dsl_model.js');


class LayoutBetween extends Model.LayoutModel {
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

        //console.log('LayoutBetween');
    }
}


module.exports = LayoutBetween;