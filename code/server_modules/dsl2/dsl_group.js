const Common = require('./dsl_common.js');
const Utils = require('./dsl_utils.js');
const Model = require('./dsl_model.js');

/**
 * 将组件进行排版布局
 * @param {Array} widgetModels 进行布局的组件模型
 * @param {Array} elementModels 进行布局的元素模型
 * @returns {Object} 返回结构树
 */
let join = function (widgetModels, elementModels) {
    if (!widgetModels && !elementModels) {
        return null;
    }
    let dslTree = new Tree();       // dsl树
    let arr = elementModels.concat(widgetModels);
    // 按面积排序
    arr.sort((a, b) => b.width * b.height - a.width * a.height);
    // 
    dslTree._setModelData(arr);
    dslTree._addNode(arr);
    // 创建layers
    dslTree._groupNode();
    dslTree._columnNode();
    
    return dslTree;
}

/**
 * DSL树的构建类,用于生成和输出标准数据
 */
class Tree {
    constructor() {
        // 创建根节点, 节点树总数据, 即为RenderData
        this._treeData = Tree.createNodeData();
        this._treeData.set('parentId', null);
        this._treeData.set('type', Common.QBody);
        this._treeData.set('abX', 0);
        this._treeData.set('abXops', Common.DesignWidth);
        this._treeData.set('isCalculate', true);

        // 组件模型信息储存
        this._modelData = {};
        // 布局模型信息储存
        this._layoutData = {};
        // 布局形式
        this._layoutType = null;
    }

    _group(parent) {
        let children = parent.children;

        // 从里面到外进行组合分析
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.children != 0) {
                // 继续进入下一层
                this._group(child);
            }
        }

        // 如果只有一个子节点，则不生成新组
        if (children.length == 1) {
            // 当只包含一个元素时就不用创建QLayer
            return;
        }
        // if (parent.id == '2D9DC358-45CD-4444-BC55-0342236C818Ec') debugger
        // 分解行
        let layers = Utils.gatherByLogic(children, function (a, b) {
            // return Utils.isYConnect(a, b, 0);
            // return Utils.isYWrap(a,b);

            // 如果a节点层级高于b，且a节点位置高于b，则为一组（a为绝对定位）
            if (parent.modelName == 'layer' || a._zIndex > b._zIndex && a._abY < b._abY) {
                return Utils.isYConnect(a, b, 0);
            } else {
                return Utils.isYWrap(a, b);
            }
        });
        // 计算边界
        layers.forEach(l => {
            let range = Utils.calRange(l);
            Object.assign(l, range);
        });
        // 自上向下排序
        layers.sort((a, b) => {
            return a.abY - b.abY;
        });

        let newChildren = [];
        layers.forEach(arr => {
            if (arr.length == 1) {
                // 当纵向节点只有一个时
                let child = arr[0];
                newChildren.push(child);
            } else { // 多个节点情况
                // 自左而右排序
                arr.sort((a, b) => {
                    return a.abX - b.abX;
                });

                let node = Tree.createNodeData();
                node.set("parentId", parent.id);
                // node.set("abX", arr.abX);
                node.set("abX", parent.abX);
                node.set("abY", arr.abY);
                // node.set("abXops", arr.abXops);
                node.set("abXops", parent.abXops);
                node.set("abYops", arr.abYops);

                arr.forEach(child => {
                    child.set("parentId", node.id);
                    node.set('children', node.children.concat(child));
                });
                newChildren.push(node);
            }
        });

        // 替换原来的结构
        parent.set("children", newChildren);
    }

    _column(parent) {
        let children = parent.children;


        // 从里面到外进行组合分析
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.children != 0) {
                // 继续进入下一层
                this._column(child);
            }
        }

        // 如果只有一个子节点，则不生成新组
        if (children.length == 1) {
            // 当只包含一个元素时就不用创建QLayer
            return;
        }

        // 分解列
        let layers = Utils.gatherByLogic(children, function (a, b) {
            return Utils.isXConnect(a, b);
        });
        // 如果只有一列，则不生成新组
        if (layers.length == 1) {
            return;
        }
        // 计算边界
        layers.forEach(l => {
            let range = Utils.calRange(l);
            Object.assign(l, range);
        });
        // 自左向右排序
        layers.sort((a, b) => {
            return a.abX - b.abX;
        });

        let newChildren = [];
        layers.forEach(arr => {
            if (arr.length == 1) {
                // 当纵向节点只有一个时
                let child = arr[0];
                newChildren.push(child);
            } else { // 多个节点情况
                // 自上而下排序
                arr.sort((a, b) => {
                    return a.abY - b.abY;
                });

                let node = Tree.createNodeData();
                node.set("parentId", parent.id);
                node.set("abX", arr.abX);
                node.set("abY", arr.abY);
                node.set("abXops", arr.abXops);
                node.set("abYops", arr.abYops);

                arr.forEach(child => {
                    child.set("parentId", node.id);
                    node.set('children', node.children.concat(child));
                });
                newChildren.push(node);
            }
        });

        // 替换原来的结构
        parent.set("children", newChildren);
    }

    /**
     * 添加元素节点
     * @param {MatchData} mdata 
     */
    _addNode(arr) {
        let body = this._treeData;
        let compareArr = [body];
        let leftArr = [];
        //let segmentings = []
        arr.forEach((child, i) => {
            if (!child || child.type == Common.QBody) {
                return;
            }
            let done = compareArr.some((parent) => {
                /**
                 * 在父节点上,
                 * 描述：parent面积必 大于等于 child面积，通过判断是否存在包含关系得出，child是否为parent子节点
                 */
                if (parent.type != Common.QText &&
                    parent.type != Common.QWidget &&
                    // 层级关系
                    child.zIndex > parent.zIndex &&
                    (
                        // 包含关系
                        (
                            Utils.isWrap(parent, child)
                        ) || (
                            Utils.isXConnect(parent, child, -1) &&
                            Utils.isYWrap(parent, child)
                        )
                        // 如果超出横向连结，纵向包含
                        /*  (
                             child.abX > parent.abX &&
                             Utils.isXConnect(parent, child, -1) &&
                             Utils.isYWrap(parent, child)
                         ) ||
                         // 纵向连接，横向包含
                         (
                             parent.abY > child.abY &&
                             Utils.isYConnect(parent, child, -1) &&
                             Utils.isXWrap(parent, child)
                         ) */

                    )) {
                    /* if (!Utils.isWrap(parent, child)) {
                    // if (child.id == 'A4CD50D4-1033-4BA5-8201-CB8277303E90c') debugger
                        child.constraints["LayoutSelfPosition"] = Constraints.LayoutSelfPosition.Absolute;
                    } */
                    let node = this._add(child, parent);
                    compareArr.unshift(node);
                    arr[i] = null;
                    return true;
                }
            });
            if (!done) {
                let node = this._add(child, body);
                compareArr.unshift(node);
                leftArr.unshift(node);
                arr[i] = null;
            }
        });
        return;
    }

    /**
     * 往父节点添加子节点
     * @param {MatchData} child 子节点
     * @param {MatchData} parent 父节点
     */
    _add(child, parent) {
        // node为RenderData
        let node = Tree.createNodeData(child);
        node.set('parentId', parent.id);
        parent.set('children', parent.children.concat(node));
        /**
         * 如果父节点为QShape或QImage时，添加子节点后，父节点模型类型改为layer，
         * 让父节点取代使用QShape或QImage模板
         * */
        if (parent.type == Common.QShape || parent.type == Common.QImage) {
            parent.set("modelName", 'layer');
        }
        // 如果父节点为widget，则当前节点绝对定位
        // if (parent.type == Common.QWidget) {
        //     node.constraints["LayoutSelfPosition"] = Constraints.LayoutSelfPosition.Absolute;
        // }
        return node;
    }

    /**
     * 储存记录添加的MatchData
     */
    _setModelData(arr) {
        arr.forEach(node => {
            this.setModelData(node);
        })
    }

    /**
     * 对节点进行成组排版
     */
    _groupNode() {
        this._group(this._treeData);
    }

    /**
     * 对节点进行成列排版
     */
    _columnNode() {
        this._column(this._treeData);
    }

    //
    setModelData(mdata) {
        if (!mdata || !mdata.id) {
            return;
        }
        this._modelData[mdata.id] = mdata;
    }

    //
    setLayoutType(layoutType) {
        this._layoutType = layoutType;
    }

    //
    getModelData(id) {
        return this._modelData[id];
    }

    // 获取RenderData数据
    getRenderData() {
        return this._treeData;
    }

    //
    getLayoutType() {
        return this._layoutType;
    }
}


// 创建layer时的自增id
Tree.LayerId = 0;

/**
 * 创建TreeNode
 * @param {MatchData} mdata
 * @returns {RenderData}
 */
Tree.createNodeData = function (mdata) {
    if (mdata && mdata.getRenderData) {
        let renderData = mdata.getRenderData();
        return renderData;
    }

    // 创建一个layer
    let renderData = new Model.RenderData();
    renderData.set('id', 'layer' + (Tree.LayerId++));
    renderData.set('type', Common.QLayer);
    renderData.set('modelName', 'layer');
    renderData.set('modelId', renderData.id);
    return renderData;
}

/**
 * 根据传进的nodes,创建返回的新node
 * @param {RenderData} parent
 * @param {Array} nodesArr
 * @param {Int} similarId
 * @return {RenderData}
 */
Tree.createCycleData = function (parent, nodesArr) {
    // 组成新节点,并且构建MatchData里的getMatchNode数据
    if (!nodesArr || nodesArr.length == 0) {
        return;
    }

    let newRenderData = new Model.RenderData();
    newRenderData.set('id', 'layer' + (Tree.LayerId++));
    newRenderData.set('parentId', parent.id);
    newRenderData.nodes = {};
    // 传进来的数据暂时只有两级结构, 所以直接coding两层循环
    for (let i = 0; i < nodesArr.length; i++) {
        let nodes = nodesArr[i];

        if (nodes.length == 0) {
            continue;
        }

        if (nodes.length == 1) { // 第二层只有一个数据直接返回
            let renderDataI = nodes[0];
            //renderDataI.set('similarId', similarId);
            renderDataI.set('modelRef', i + '');
            // 递归读取nodes的节点
            Tree._handleCycleData(renderDataI, nodes[0]);
            // 这里先改用key-value的形式储存在nodes,规避放.childrend的问题
            //newRenderData.children.push(renderDataI);
            newRenderData.nodes[i + ''] = renderDataI;
            continue;
        }

        let nodeI = new Model.RenderData();
        nodeI.set('parentId', newRenderData.id);
        nodeI.set('modelRef', i + '');
        nodeI.nodes = {};
    
        for (let j = 0; j < nodes.length; j++) {
            let nd = nodes[j];
            let renderDataJ = nd;
            renderDataJ.set('modelRef', j + '');
            // 递归读取nodes的节点
            Tree._handleCycleData(renderDataJ, nd);
            // 这里同上, 先改用key-value的形式
            //nodeI.children.push(renderDataJ);
            nodeI.nodes[j + ''] = renderDataJ;
        }
        nodeI.resize(true); // 新节点重新计算最小范围
        newRenderData.children.push(nodeI);
    }

    // 把parent的属性重新设置
    newRenderData.resize(true);
    newRenderData.set('modelName', 'cycle-01');
    newRenderData.set('type', Common.QLayer);
    
    return newRenderData;
}

/**
 * 递归读取nodes里面的Render数据
 * @param {RenderData} parentData 拼装的parent
 * @param {Array} nodes 要解析的节点
 */
Tree._handleCycleData = function(parentData, nodes) {
    let children = nodes.children;
    if (children.length == 0) {
        return;
    }

    for (let i = 0; i < children.length; i++) {
        let rdata = children[i];
        parentData.children.push(rdata);

        // 递归解析
        Tree._handleCycleData(rdata, children[i]);
    }
};


module.exports = {
    join,
    Tree
}