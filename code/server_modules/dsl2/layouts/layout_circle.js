// 循环结构的逻辑处理模块
const Common = require('../dsl_common.js');
const Utils = require('../dsl_utils.js');
const Model = require('../dsl_model.js');
const Group = require('../dsl_group.js');
const Constraints = require('../dsl_constraints');


class LayoutCircle extends Model.LayoutModel {
    constructor(modelType) {
        super(modelType);
        this.similarIndex = 1;
    }

    /**
     * 主流程：对传进来的模型数组进行循环分析处理
     * @param {TreeNode} parent 树节点
     * @param {Array} nodes 树节点数组
     * @param {Array} models 对应的模型数组
     * @param {Int} layoutType 布局的类型
     */
    handle(parent, nodes, models, layoutType) {
        // if(parent.type==)
        if (!nodes || nodes.length == 0) {
            // 如果没有子节点，则返回
            return;
        }
        // 找出需要对比的结构
        let compareNodes = this._filterCompare(nodes);
        // 找出相似结构组合
        let similarArr = this._findSimilar(compareNodes, this._similarRule, null);
        // 相似结构处理
        this._setSimilar(parent, nodes, similarArr);

    }
    // 相似结构处理
    _setSimilar(parent, nodes, similarArr) {
        if (similarArr.length == 0) {
            // 如果没有相似结构，则返回
            return;
        }
        let inSimilar = [];
        // 获取循环节点
        similarArr.forEach(item => {
            if (item.feature != 1) return;
            let similarId = this.similarIndex++;
            item.target.forEach(group => {
                group.forEach(nd => {
                    nd.set('similarId', similarId);
                })
            })
            // 提取循环节点
            // item.target.forEach(group => inSimilar.push(...group))
            // 合并循环节点为新节点
            // let newCycleData = Group.Tree.createCycleData(parent, item.target, similarId);
            // 加入新节点到父级元素
            // nodes.push(newCycleData);
        });
        // 从节点中剔除被循环的节点
        // nodes = nodes.filter(nd => {
        // return !inSimilar.includes(nd);
        // });
        parent.set("children", nodes);
    }

    // 剔除绝对定位元素，绝对定位元素不参与循环判断
    _filterCompare(arr) {
        return arr.filter(nd => {
            return nd.constraints["LayoutSelfPosition"] != Constraints.LayoutSelfPosition.Absolute;
        });
    }
    // 相似节点逻辑
    _similarRule(a, b) {
        /**
         * 逻辑：
         * 1. 模型名称相似
         * 2. 如果是layer，layer子节点相似
         * 3. 如果非layer，三基线对齐
         */
        return a.modelName == b.modelName &&
            // 如果为布局结构，则子节点宽度相同
            (a.modelName == 'layer' ?
                (a.children.length == b.children.length &&
                    a.children.every((ndA, i) => {
                        return b.children[i].modelName == ndA.modelName
                    })
                ) : (
                    // 如果为模型结构，三线对齐相同
                    a.abY == b.abY ||
                    a.abYops == b.abYops ||
                    a.abY + a.height / 2 == b.abY + b.height / 2 ||
                    a.abX == b.abX ||
                    a.abXops == b.abXops ||
                    a.abX + a.width / 2 == b.abX + b.width / 2
                ));
    }
    /**
     * 相似性分组
     * @param {Array} arr 对比数组
     * @param {Function} similarLogic 相似逻辑
     * @param {Function} featureLogic 特征逻辑
     * 返回结构
     * [
     *  //组合类型
     *  [
     *      //该组合结果
     *      [
     *          //每个结果内容
     *      ],
     *      ...
     *  ],
     *  ...
     * ]
     */
    _findSimilar(arr, similarLogic, featureLogic) {
        let pit = [];
        // 相似特征分组
        arr.forEach((s, i) => {
            // 开始遍历
            let lastIndex = i + 1;
            for (let index = 0; index < lastIndex; index++) {
                // 获取片段
                let fragment = arr.slice(index, lastIndex);
                if (featureLogic && !featureLogic(fragment)) {
                    continue;
                }
                // 排除完全重复的独立项
                if (fragment.length > 1 && fragment.every((s, i) => {
                    return i == 0 || (similarLogic ? similarLogic(s, fragment[i - 1]) : s == fragment[i - 1])
                })) {
                    continue;
                }

                // 判断重复片段
                pit.some(p => {
                    // existing:当前片段与缓存片段，每一段都符合逻辑特征判断
                    let existing = p.feature == fragment.length && p.target.some(t => {
                        //  只有一个特征时，还须连续的重复；多个特征时，只需逻辑相同
                        return (p.feature == 1 ? index == p.lastIndex + 1 : true) &&
                            t.every((f, fi) => {
                                return similarLogic ? similarLogic(f, fragment[fi]) : (f == fragment[fi]);
                            });
                    });

                    if (existing && (p.lastIndex + p.feature) <= index) {
                        // 如果重复，且当前节点在上一个重复片段的节点之后
                        p.target.push(fragment);
                        p.indexs.push(index);
                        p.lastIndex = index;
                        return true;
                    }
                }) || (pit.push({
                    feature: fragment.length,
                    target: [fragment],
                    indexs: [index],
                    lastIndex: index
                }));
            }
        });
        let indexMap = new Array(arr.length);
        //  剔除不重复项
        let sorter = pit.filter(s => s.target.length > 1)
            //  按最高重复数，降序
            .sort((a, b) => {
                return b.target.length - a.target.length
            })
            // 按最大重复因子数， 降序
            .sort((a, b) => {
                return b.feature - a.feature
            })
            //  筛选已被选用的节点组
            .filter(s => {
                let indexs = [];
                s.target = s.target.filter((target, idx) => {
                    let index = s.indexs[idx];
                    //  提取序列组，检测重复组的序列是否已经被使用过
                    if (indexMap.slice(index, index + s.feature).every(i => i !== true)) {
                        indexs.push(index);
                        return true;
                    }
                });
                //  剔除只有一个重复项的重复组
                if (s.target.length > 1) {
                    s.indexs = indexs;
                    indexs.forEach(index => {
                        indexMap.fill(true, index, index + s.feature);
                    });
                    return true;
                }
            })
        return sorter;
    }
}

module.exports = new LayoutCircle();