// Flex布局模型处理
const Common = require('../dsl_common.js');
const Utils = require('../dsl_utils.js');
const Model = require('../dsl_model.js');
const Constrains = require('../dsl_constraints');

// flex layout 的处理核心是
// 
// 只有一个元素: 竖排
// 多于一个元素
// 竖排: 竖排的处理逻辑是子节点在y轴并不相交
// 横排: 非竖排的情况
//
// 横排的时候对QWidget, QImage, QText, QIcon, QShape的处理逻辑为:
// （可继续优化, 基于对模型分析）
// 1: 如果
// s2: 其余的以绝对定位


class LayoutFlex extends Model.LayoutModel {
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
        if (Utils.isVertical(nodes)) {
            this._sort(nodes, 'abY');
            this._handleVertical(parent, nodes, models);
        } else {
            this._sort(nodes, 'abX');
            this._handleHorizontal(parent, nodes, models);
        }
    }

    /**
     * 对子元素进行竖排处理
     * @param {Node} parent
     * @param {Array} nodes 
     * @param {Array} models 
     */
    _handleVertical(parent, nodes, models) {
        parent.constraints['LayoutDirection'] = Constrains.LayoutDirection.Vertical;
        parent.constraints['LayoutAlignItems'] = Constrains.LayoutAlignItems.Start;
        // 高度不需要处理
        let calNodes = [],
            absNodes = [];
        // 剔除绝对定位节点
        nodes.forEach(nd => {
            if (nd.constraints["LayoutSelfPosition"] == Constrains.LayoutSelfPosition.Absolute) {
                nd.isCalculate = true;
                absNodes.push(nd)
            } else {
                calNodes.push(nd);
            }
        });

        for (let i = 0; i < calNodes.length; i++) {
            let nd = calNodes[i];
            // let prev = calNodes[i - 1];
            let prev = this._getPrev(nodes, nd, absNodes);
            if (prev && Utils.isYWrap(prev, nd)) {
                // 重叠逻辑： 如果在Y轴上完全重合，则层级高的为绝对定位
                absNodes.push(prev.zIndex > nd.zIndex ? prev : nd);
            }
            else if (prev && prev.zIndex > nd.zIndex && Utils.isYConnect(prev, nd, -4)) {
                // 重叠逻辑：如果部分重叠，且前（上）节点层级高，则为绝对定位
                absNodes.push(prev);
            }
        }
        // 赋予非轴线节点为绝对定位
        for (let i = 0; i < calNodes.length; i++) {
            let nd = calNodes[i];
            nd.isCalculate = true; // 约束计算完成
            if (absNodes.includes(nd)) {
                this._setAbsolute(nd);
            } else {
                if (nd.canLeftFlex) {
                    nd.set("abX", parent.abX);
                }

                if (nd.canRightFlex) {
                    nd.set("abXops", parent.abXops);
                }
            }
        };
        if (absNodes.length > 0) {
            // 父节点赋予相对定位约束
            parent.constraints["LayoutPosition"] = Constrains.LayoutPosition.Absolute;
        }
    }

    /**
     * 对子元素进行横排处理
     * @param {Node} parent
     * @param {Array} nodes 
     * @param {Array} models 
     */
    _handleHorizontal(parent, nodes, models) {
        parent.constraints['LayoutDirection'] = Constrains.LayoutDirection.Horizontal;
        parent.constraints['LayoutJustifyContent'] = Constrains.LayoutJustifyContent.Start;
        // 横向的排列原则先简单按照:
        // 1, 从左往右,从上往下排列
        // 2, 从最左开始计算出x轴上不相交的元素组成横向一排
        // 3, 没能排列的元素, 若与某元素相交, 则包含进相交元素, 否则加到parent处
        let calNodes = [],
            absNodes = [];
        // 剔除绝对定位节点
        nodes.forEach(nd => {
            if (nd.constraints["LayoutSelfPosition"] == Constrains.LayoutSelfPosition.Absolute) {
                nd.isCalculate = true;
                absNodes.push(nd)
            } else {
                calNodes.push(nd);
            }
        });

        var top = parent.abY,
            bottom = parent.abYops,
            middle = (parent.abY + parent.abYops) / 2,
            topArr = [],
            bottomArr = [],
            middleArr = [];
        calNodes.forEach(nd => {
            if (Math.abs(nd.abY - top) < 3) {
                topArr.push(nd);
            }
            if (Math.abs(nd.abYops - bottom) < 3) {
                bottomArr.push(nd);
            }
            if (Math.abs((nd.abYops + nd.abY) / 2 - middle) < 3) {
                middleArr.push(nd);
            }
        });
        // 获得最多相同基线的节点
        let maxArr = [topArr, bottomArr, middleArr].sort((a, b) => {
            return b.length - a.length;
        })[0];
        // 赋予副轴约束
        if (maxArr.length == 1) {
            // 如果最大基线元素只有一个，则选面积最大的
            maxArr = [calNodes.slice().sort((a, b) => {
                return b.width * b.height - a.width * a.height;
            })[0]]
        } else if (maxArr == topArr) {
            parent.constraints["LayoutAlignItems"] = Constrains.LayoutAlignItems.Start
        } else if (maxArr == middleArr) {
            parent.constraints["LayoutAlignItems"] = Constrains.LayoutAlignItems.Center
        } else if (maxArr == bottomArr) {
            parent.constraints["LayoutAlignItems"] = Constrains.LayoutAlignItems.End
        }
        // 赋予非轴线节点为绝对定位
        calNodes.forEach(nd => {
            if (!maxArr.includes(nd)) {
                absNodes.push(nd);
                nd.isCalculate = true; // 约束计算完成
            }
        });
        if (absNodes.length > 0) {
            parent.constraints["LayoutPosition"] = Constrains.LayoutPosition.Absolute;
            absNodes.forEach(nd => {
                this._setAbsolute(nd);
            })
        }
    }

    // 筛选前排序
    _sort(nodes, opt) {
        nodes.sort((a, b) => {
            return a[opt] - b[opt];
        })
    }

    _getPrev(nodes, node, absArr) {
        let prev = null;
        nodes.some(nd => {
            if (nd == node) {
                return true;
            }
            // if (nd.constraints["LayoutSelfPosition"] != Constrains.LayoutSelfPosition.Absolute) {
            if (!absArr.includes(nd)) {
                prev = nd;
            }
        });
        return prev;
    }
    _setAbsolute(node) {
        node.constraints["LayoutSelfPosition"] = Constrains.LayoutSelfPosition.Absolute;
        node.constraints["LayoutFixedWidth"] = node.constraints["LayoutFixedWidth"] || Constrains.LayoutFixedWidth.Fixed
        node.constraints["LayoutFixedHeight"] = node.constraints["LayoutFixedHeight"] || Constrains.LayoutFixedHeight.Fixed
    }
}

module.exports = LayoutFlex;