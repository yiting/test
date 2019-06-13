// 循环结构的逻辑处理模块
const Common = require('../dsl_common.js');
const Utils = require('../dsl_utils.js');
const Model = require('../dsl_model.js');
const Group = require('../dsl_group.js');
const Constraints = require('../dsl_constraints');


class LayoutSimilar extends Model.LayoutModel {
    constructor(modelType) {
        super(modelType);
        this.similarIndex = 1;
    }

    /**
     * 主流程：对传进来的模型数组进行循环分析处理
     * @param {TreeNode} parent 树节点
     * @param {Int} layoutType 布局的类型
     */
    handle(parent, layoutType) {
        this._compareNodes = {}
        // 找出所有需要对比的结构
        this._filterCompareNodes(parent);
        // 找出相似结构组合
        Object.keys(this._compareNodes).forEach(key => {
            let compareNodes = this._compareNodes[key];
            compareNodes.sort((a, b) => {
                return a.width * a.height - b.width * b.height;
            })
            // 找到相似结构
            let similarArr = Utils.gatherByLogic(compareNodes, this._similarRule);
            // 相似结构处理
            this._setSimilar(similarArr);
        });

    }
    // 相似结构处理
    _setSimilar(similarArr) {
        if (similarArr.length == 0) {
            // 如果没有相似结构，则返回
            return;
        }
        // 遍历循环节点
        similarArr.forEach(item => {
            // 如果组内只有一个节点，说明没有相似
            if (item.length == 1) return;
            let similarId = this.similarIndex++;
            item.forEach(obj => {
                obj.node.set('similarId', similarId);
            });
        });
    }
    /**
     * 筛选参与判断的元素
     * @param {Array} node 
     */
    _filterRule(node) {
        // 剔除绝对定位元素，绝对定位元素不参与循环判断
        if (node.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute ||
            (node.modelName != 'layer' &&
                node.type != Common.QWidget)
        ) {
            return;
        }
        if (!this._compareNodes[node.modelName]) {
            this._compareNodes[node.modelName] = []
        }
        this._compareNodes[node.modelName].push({
            node,
            "abX": node.abX,
            "abXops": node.abXops,
            "abY": node.abY,
            "abYops": node.abYops,
            "ctX": (node.abX + node.abXops) / 2,
            "ctY": (node.abY + node.abYops) / 2,
            "height": node.abYops - node.abY,
            "width": node.abXops - node.abX,
            "modelName": node.modelName,
            "isHorizontal": Utils.isHorizontal(node.children),
            "compareChildren": node.children.filter(child => {
                return child.constraints["LayoutSelfPosition"] != Constraints.LayoutSelfPosition.Absolute
            })
        });
    }
    // 遍历所有结构
    _filterCompareNodes(node) {
        this._filterRule(node);
        node.children && node.children.forEach(nd => this._filterCompareNodes(nd));
    }

    // 相似节点逻辑
    _similarRule(a, b) {
        /**
         * 逻辑：
         * 1. 模型名称相似
         * 2. 如果是layer，layer子节点相似,三基线对齐
         * 3. 如果非layer，三基线对齐
         * 4. 如果没有子节点，则相似
         */
        if (a.modelName != b.modelName) {
            return
        };
        let isConnect = Utils.isConnect(a.node, b.node, -1)
        if (isConnect) {
            // 如果相连，则为不同
            return;
        }
        if (a.node.type == Common.QLayer) {
            return a.isHorizontal == b.isHorizontal &&
                a.compareChildren.length == b.compareChildren.length &&
                a.compareChildren.every((ac, i) => {
                    let bc = b.compareChildren[i];
                    return ac.modelName == bc.modelName
                }) &&
                (
                    (a.height == b.height &&
                        (a.abX == b.abX ||
                            a.abXops == b.abXops ||
                            a.ctX == b.ctX)
                    ) || (
                        a.width == b.width &&
                        (a.abY == b.abY ||
                            a.abYops == b.abYops ||
                            a.ctY == b.ctY / 2)
                    )
                )
        } else if (a.node.type == Common.QWidget) {
            // 如果为Widget，三线对齐相同
            return a.abY == b.abY ||
                a.abYops == b.abYops ||
                a.ctY == b.ctY ||
                a.abX == b.abX ||
                a.abXops == b.abXops ||
                a.ctX == b.ctX ||
                (a.width == b.width && a.height == b.height)
        } else if (a.node.type == Common.QElement) {
            // 如果为Element，则同父节点，子节点数相同，三线对齐相同
            return a.parentId == b.parentId &&
                (a.abY == b.abY ||
                    a.abYops == b.abYops ||
                    a.ctY == b.ctY ||
                    a.abX == b.abX ||
                    a.abXops == b.abXops ||
                    a.ctX == b.ctX)
        }
    }
}

module.exports = new LayoutSimilar();