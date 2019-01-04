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
       
        if (this._isVerticalLayout(nodes)) {
            this._handleVertical(parent, nodes, models);
        }
        else {
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

        // 处理宽度
        // 根据leftFlex和rightFlex决定节点可以扩展到什么位置
        for (let i = 0; i < nodes.length; i++) {
            let nd = nodes[i];
            // 绝对定位的忽略不处理
            if (nd.constraints['LayoutSelfPosition']
                && nd.constraints['LayoutSelfPosition'] == Constrains.LayoutSelfPosition.Absolute) {

                nd.isCalculate = true;
                continue;
            }

            if (nd.canLeftFlex) {
                nd.abX = parent.abX;
            }

            if (nd.canRightFlex) {
                nd.abXops = parent.abXops;
            }

            nd.width = nd.abXops - nd.abX;
            nd.isCalculate = true;          // 约束计算完成
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


        // 这里的layoutFlex的排版算法

        this._sort(nodes);

        let preNode = null;
        let needRemoves = [];
        for (let i = 0; i < nodes.length; i++) {
            let nd = nodes[i];
            // 绝对定位的忽略不处理
            if (nd.constraints['LayoutSelfPosition']
                && nd.constraints['LayoutSelfPosition'] == Constrains.LayoutSelfPosition.Absolute) {
                
                nd.isCalculate = true;
                continue;
            }

            if (preNode) {
                // x轴投影相交
                if (nd.abX < preNode.abXops) {
                    if (nd.abYops < preNode.abY || nd.abY > preNode.abYops) {
                        // y轴不相交, 则独立分离, 不用添加到preNode里面
                        nd.constraints['LayoutSelfPosition'] = Constrains.LayoutSelfPosition.Absolute;
                    }
                    else {
                        // y轴也相交, 放入该子元素
                        nd.constraints['LayoutSelfPosition'] = Constrains.LayoutSelfPosition.Absolute;
                        preNode.children.push(nd);
                        needRemoves.push(nd);
                    }

                    nd.isCalculate = true;
                    continue;
                }
            }

            nd.isCalculate = true;
            preNode = nd;
        }

        // if (needRemoves.length > 0) {
        //     console.log('+++++++++++++++++++++');
        //     console.log(needRemoves);
        //     //Utils.removeMatchedNodes(nodes, needRemoves);
        //     //console.log(needRemoves);
        // }
    }

    // 筛选前排序
    _sort(arr) {
        return arr.map(o => {
            return Object.assign({}, o, {
                cX: o.abX + o.width / 2,
                cY: o.abY + o.height / 2
            })
        }).sort(function (a, b) {
            if (a.cX < b.cX) {
                return -1;
            } else if (a.cY > b.cY)
                return 1;
        })
    }
}


module.exports = LayoutFlex;
