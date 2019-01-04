// 循环结构的逻辑处理模块
const Common = require('../dsl_common.js');
const Utils = require('../dsl_utils.js');
const Model = require('../dsl_model.js');
const Group = require('../dsl_group.js');


class LayoutCircle extends Model.LayoutModel {
    constructor(modelType) {
        super(modelType);
    }

    /**
     * 对传进来的模型数组进行循环分析处理
     * @param {TreeNode} parent 树节点
     * @param {Array} nodes 树节点数组
     * @param {Array} models 对应的模型数组
     * @param {Int} layoutType 布局的类型
     */
    handle(parent, nodes, models, layoutType) {
        console.log('-------- handle circle -------');

        if (!nodes || nodes.length == 0) {
            return;
        }

        // 找出相似结构
        this._sort(nodes);
        let similarArr = this._similar(nodes);
        
        if (similarArr.length == 0) {
            console.log('-------- handle circle 没有相似结构 -------');
            return;
        }

        // result的结构是?
        let result = this._filter(similarArr);

        // 如果result有效, 则改变parent的结构
        if (!result || result.length == 0) {
            console.log('-------- handle circle 有相似结构但特性特征不符合 -------');
            return;
        }

        // 把parent.children里的节点重新调整
        // 1, 结构相似的, 假如这个结构包含两个以上节点则创建一个layer作为容器
        // 2, 剩余的直接加入parent.children, 
        // 3, 改变后的节点顺序会在 dsl_layout._handleLayout 处重新排列
        let res = result[0][0];
        if (!res || res.length == 0) {
            console.log('-------- handle circle: res返回出错 -------');
            return;
        }

        parent.children = new Array();       // 重置子节点数组
        let inSimilar = [];                  // 所有相似结构的节点, 

        res.forEach(item => {
            if (item.length == 1) {
                // 不需要成组
                inSimilar.push(item[0]);
                parent.children.push(item[0]);
            }
            else {
                let layer = Group.Tree.createNodeData();
                layer.parentId = parent.id;
                item.forEach(nd => {
                    nd.parentId = layer.id;
                    inSimilar.push(nd);
                    layer.children.push(nd);
                });

                // !重要, 设定出layer的abX, abY, abXops, abYops, width, height
                this._initNewNode(layer);
                parent.children.push(layer);
            }
        });

        // 把没有在inSimilar的添加回parent
        for (let i = 0; i < nodes.length; i++) {
            let nd = nodes[i];
            let isNewOne = true;

            for (let j = 0; j < inSimilar.length; j++) {
                if (nd.id == inSimilar[j].id) {
                    isNewOne = false;
                    break;
                }
            }

            if (isNewOne) {
                parent.children.push(nd);
            }
        }
    }

    // 计算一个初始化数值
    _initNewNode(node) {
        for (let i = 0; i < node.children.length; i++) {
            let nd = node.children[i];
            if (i == 0) {
                node.abX = nd.abX;
                node.abY = nd.abY;
                node.abXops = nd.abXops;
                node.abYops = nd.abYops;
                continue;
            }

            node.abX = (nd.abX < node.abX)? nd.abX : node.abX;
            node.abY = (nd.abY < node.abY)? nd.abY : node.abY;
            node.abXops = (nd.abXops > node.abXops)? nd.abXops : node.abXops;
            node.abYops = (nd.abYops > node.abYops)? nd.abYops : node.abYops;
        }

        node.width = node.abXops - node.abX;
        node.height = node.abYops - node.abY;
    }

    // 计算在垂直关系
    _isXWrap(a, b) {
        return Math.abs(a.abX + a.width / 2 - b.abX - b.width / 2) <=
            Math.abs(a.width - b.width) / 2
    }

    // 
    _calRange(arr) {
        let o = {
            abX: Number.POSITIVE_INFINITY,
            abY: Number.POSITIVE_INFINITY,
            width: 0,
            height: 0
        }
        let right = 0,
            bottom = 0
        arr.forEach((d, i) => {
            o.abX = d.abX < o.abX ? d.abX : o.abX;
            o.abY = d.abY < o.abY ? d.abY : o.abY;
            right = right < (d.abX + d.width) ? (d.abX + d.width) : right;
            bottom = bottom < (d.abY + d.height) ? (d.abY + d.height) : bottom;
        });
        o.height = bottom - o.abY;
        o.width = right - o.abX;
        o.cX = o.abX + o.width / 2;
        o.cY = o.abY + o.height / 2;
        return o;
    }

    // 分组前的排序
    _sort(arr) {
        // 筛选前排序
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

    // 找到循环结构
    _similar(arr) {
        let self = this;
        return Utils.similarRule(arr,
            function (a, b) {
                return a.modelName == b.modelName &&
                    (a.abY == b.abY ||
                        a.abY + a.height == b.abY + b.height ||
                        a.abY + a.height / 2 == b.abY + b.height / 2);
            },
            function (features) {
                return features.every((d, i) => {
                    return i == 0 || self._isXWrap(d, features[i - 1]);
                })
            }
        )
    }

    // 
    _filter(result) {
        return result.map(feature => {
            let targets = []
            // 遍历节点位置
            feature.target.forEach(doms => {
                let range = this._calRange(doms);
                targets.push(
                    Object.assign({
                        doms,
                    }, range)
                );
            });
            let dir,
                arr = [],
                cur = [];
            // 排序
            targets.sort(function (a, b) {
                return a.cX - b.cX;
            }).forEach(function (o, i) {
                // 间距计算
                let prev = targets[i - 1];
                if (!prev) {
                    arr.push(cur);
                    cur.push(o.doms)
                    return;
                }
                if (isNaN(dir)) {
                    dir = o.cX - prev.cX
                    cur.push(o.doms);
                    return;
                }
                if (dir == o.cX - prev.cX) {
                    cur.push(o.doms);
                } else {
                    cur = [o.doms];
                    arr.push(cur);
                    dir = o.cX - prev.cX;
                }
    
            })
            return arr;
        });
    }
}

module.exports = new LayoutCircle();
