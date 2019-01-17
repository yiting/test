// LayoutFlex下等分布局修正

const Common = require('../dsl_common.js');
const Model = require('../dsl_model.js');
const Utils = require('../dsl_utils.js');
const Constrains = require('../dsl_constraints');


class LayoutEquality extends Model.LayoutModel {
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
        let flexNodes = nodes.filter(nd => {
            return nd.constraints && nd.constraints["LayoutPosition"] !== Constrains.LayoutPosition.Absolute;
        });
        if (flexNodes.length == 0) {
            return
        }
        flexNodes.sort((a, b) => a.abX - b.abX);
        // 如果子节点不一样，则返回
        if (!this._isAllSameModel(flexNodes)) {
            return;
        }
        // 如果子节点不水平，则返回
        if (!Utils.isHorizontal(flexNodes)) {
            return;
        }
        // 如果边距不一致，则返回
        let minSide = this._isEqualitySide(flexNodes, parent)
        if (!minSide) {
            return;
        }
        let minDir = this._isEqualityBetween(flexNodes);
        // 如果间距不一致，则返回
        if (!minDir) {
            return;
        }
        let minSpace = Math.min(minSide * 2, minDir);
        this._adjustModelPos(flexNodes, minSpace);
        parent.constraints["LayoutJustifyContent"] = Constrains.LayoutJustifyContent.Center;
    }
    _adjustModelPos(nodes, width) {
        nodes.forEach(nd => {
            let dir = Math.floor(width - nd.width) / 2;
            nd.set("abX", nd.abX - dir);
            nd.set("abXops", nd.abXops + dir);
            // nd.width = nd.abXops - nd.abX;
            /**
             * bug：width渲染失效
             */
        });
    }
    _isAllSameModel(nodes) {
        let modelName;

        return nodes.length > 1 && nodes.every(nd => {
            let isSameModel = !modelName || nd.modelName == modelName;
            modelName = nd.modelName;
            return isSameModel;
        });
    }
    _isEqualitySide(nodes, parent) {
        let firstNode = nodes[0],
            lastNode = nodes[nodes.length - 1],
            left = firstNode.abX - parent.abX,
            right = parent.abXops - lastNode.abXops,
            isEq = Math.abs(left - right) < 4

        return isEq && Math.min(left + firstNode.width / 2, right + lastNode.width / 2);
    }
    _isEqualityBetween(nodes) {
        // 中心点数组
        let dirArr = [];
        let centerArr = nodes.map(nd => {
            return (nd.abX + nd.abXops) / 2;
        });
        // 最小间距
        let minDir = Number.MAX_VALUE;
        centerArr.forEach((ctr, i) => {
            let prevCtr = centerArr[i - 1];
            if (prevCtr) {
                let dir = ctr - prevCtr;
                dirArr.push(dir);
                minDir = dir < minDir ? dir : minDir;
            }
        });
        // 间距是否相等
        let isEq = true;
        dirArr.forEach((dir, i) => {
            let prevDir = dirArr[i - 1];
            // 中心间距差小于4
            isEq = isEq && (!prevDir || Math.abs(prevDir - dir) < 4);
        });
        return isEq && minDir;
    }
}


module.exports = LayoutEquality;