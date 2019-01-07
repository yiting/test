const Common = require('./dsl_common.js');
const Utils = require('./dsl_utils.js');
const Constraints = require('./dsl_constraints.js');

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
    let tree = new Tree(); // dsl树
    let arr = elementModels.concat(widgetModels);
    // 按面积排序
    arr.sort((a, b) => b.width * b.height - a.width * a.height);
    // 
    tree._setModelData(arr);
    tree._addNode(arr);
    // 创建layers
    tree._groupNode();
    tree._columnNode();

    return tree;
}

/**
 * DSL树的构建类,用于生成和输出标准数据
 */
class Tree {
    constructor() {
        // 节点树
        this._treeData = Tree.createNodeData();
        this._treeData.set("type", Common.QBody);
        this._treeData.set("abX", 0);
        this._treeData.set("abXops", Common.DesignWidth);
        this._treeData.isCalculate = true;

        // 组件模型信息储存
        this._modelData = {};
        // 布局模型信息储存
        this._layoutData = {};
        // 布局形式
        this._layoutType = null;
    }

    // 组成包含关系的节点
    /* _add(parent, mdata) {
        let children = parent.children;

        // 这里先给一个临时标识,在判断包含关系时有需要
        if (mdata.width >= parent.width &&
            (mdata.type == Common.QImage || mdata.type == Common.QShape)) {
            // 假如加入的节点的宽度大于等于父节点的宽度, 则有可能作为节点
            console.log(mdata.id)
        }

        if (children.length == 0 && parent.type == Common.QBody) {
            // 根节点直接添加
            let node = Tree.createNodeData(mdata);
            node.parentId = parent.id;
            children.push(node);
            return;
        }

        // 是否被子节点包含
        // 同时这个子节点必须为QImage或者QShape
        let isContainByChild = false;
        let tempIndex = 0;
        // if (mdata.id == '43B0FB88-9CD8-4CA7-AF7E-A6D5BCB3DA51'){
        //     debugger
        // }
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if ((child.type == Common.QImage || child.type == Common.QShape)) {
                // 判断是否能被包围, 可以则加入
                if (child.asBackground) {
                    // 可以作为背景容器使用,此时因为容器可能为能横向滚动的容器,有些元素会在边界上而超出,
                    // 所以只需相交则可
                    if (Utils.isNodeAcontainNodeB(child, mdata)) {
                        isContainByChild = true;
                        tempIndex = i;
                        break;
                    }
                } else {
                    // 必须完全包含才可以
                    if (Utils.isNodeAfullcontainNodeB(child, mdata)) {
                        isContainByChild = true;
                        tempIndex = i;
                        break;
                    }
                }
            }
        }

        if (isContainByChild) {
            // 递归进子节点判断包含关系
            this._add(children[tempIndex], mdata);
        } else {
            // 直接添加进parent
            let node = Tree.createNodeData(mdata);
            node.parentId = parent.id;
            children.push(node);
        }
    } */

    // 创建QLayer
    /* _group(parent) {
        let children = parent.children;

        // 从里面到外进行组合分析
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.children.length != 0) {
                // 继续进入下一层
                this._group(child);
            }
        }

        // 进行成组计算
        if (children.length == 1) {
            // 当只包含一个元素时就不用创建QLayer
            return;
        }

        // 节点再次成组遵循从上到下, 从左到右的编写代码逻辑
        let layers = Utils.groupByYaxis(children);
        Utils.sortListByParam(layers, 'minY'); // 从上往下

        let newChildren = [];
        layers.forEach(arr => {
            if (arr.length == 1) {
                // 当横排的节点只有一个时, 如果它的宽度已经等于大于父元素宽度,(QShape, QImage, QWidget)
                // 则直接作为QLayer排版了, 否则创建一个QLayer用于包含节点
                let child = arr[0];
                if (child.width >= parent.width) {
                    newChildren.push(child);
                } else {
                    newChildren.push(child);
                }
            } else { // 多个节点情况
                Utils.sortListByParam(arr, 'abX'); // 从左至右

                let node = Tree.createNodeData();
                node.set("parentId", parent.id);
                // node.abX = 0;
                node.set('abX', parent.abX);
                node.set('abY', arr.minY);
                node.set('abXops', parent.width);
                node.set('abYops', node.abY + arr.maxY - arr.minY);

                arr.forEach(child => {
                    child.set('parentId', node.id);
                    node.set('children', node.children.concat(child));
                });
                newChildren.push(node);
            }
        });

        // 替换原来的结构
        parent.set("children", newChildren);
    } */
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

        // 分解列
        let layers = Utils.gatherByLogic(children, function (a, b) {
            return Utils.isYConnect(a, b, 0);
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
                    // 如果超出横向屏幕范围，则相连则纳入包含
                    ((Utils.isXConnect(parent, child, -1) && Utils.isYWrap(parent, child)) ||
                        Utils.isWrap(parent, child))) {
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
    _add(child, parent) {
        let node = Tree.createNodeData(child);
        node.set("parentId", parent.id);
        parent.set('children', parent.children.concat(node));
        // 如果父节点为widget，则当前节点绝对定位
        // if (parent.type == Common.QWidget) {
        //     node.constraints["LayoutSelfPosition"] = Constraints.LayoutSelfPosition.Absolute;
        // }
        return node;
    }
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

    /**
     * 获取tree的json数据
     */
    getData() {
        return this._treeData.toJSON();
    }


    getJSON() {
        return this._treeData
    }

    //
    getLayoutType() {
        return this._layoutType;
    }
}

Tree.LayerId = 0;

/* Tree.createNodeData = function (mdata) {
    // 节点储存的数据
    let obj = {
        parentId: null, // 父节点id
        id: null, // id值
        type: Common.QLayer, // 默认用于布局
        modelName: 'layer', // 模型的模型名
        x: 0, // x坐标
        y: 0, // y坐标
        abX: 0, // 基于原点的x坐标
        abY: 0, // 基于原点的y坐标
        abXops: 0, // 基于原点的x坐标对角
        abYops: 0, // 基于原点的y坐标对角
        width: 0, // 节点宽
        height: 0, // 节点高
        canLeftFlex: false, // 可左扩展
        canRightFlex: false, // 可右扩展
        isCalculate: false, // 是否已经完成约束计算
        constraints: {}, // 添加的约束
        children: [], // 子节点
        zIndex: 0 // 显示层级
    };

    // 组件还是Layer
    if (mdata) {
        obj.id = mdata.id;
        obj.type = mdata.type;
        obj.modelName = mdata.modelName;
        obj.x = mdata.x;
        obj.y = mdata.y;
        obj.abX = mdata.abX;
        obj.abY = mdata.abY;
        obj.abXops = mdata.abX + mdata.width;
        obj.abYops = mdata.abY + mdata.height;
        obj.width = mdata.width;
        obj.height = mdata.height;
        obj.canLeftFlex = mdata.canLeftFlex;
        obj.canRightFlex = mdata.canRightFlex;
        obj.zIndex = mdata.zIndex;
    } else {
        obj.id = 'layer' + Tree.LayerId;
        Tree.LayerId++;
    }

    return obj;
}*/
class Node {
    constructor(mdata = {}) {
        this._parentId = null; // 父节点id
        this.id = mdata.id || ('layer' + (Tree.LayerId++));
        this._type = mdata.type || Common.QLayer; // 默认用于布局
        this._modelName = mdata.modelName || 'layer'; // 模型的模型名
        this._abX = mdata.abX || 0; // 基于原点的x坐标
        this._abY = mdata.abY || 0; // 基于原点的y坐标
        this._abXops = mdata.abXops || 0; // 基于原点的x坐标对角
        this._abYops = mdata.abYops || 0; // 基于原点的y坐标对角
        this._zIndex = mdata.zIndex || 0; // 显示层级
        this._constraints = {}; // 添加的约束
        this._children = mdata.children || []; // 子节点
        this._mdata = mdata;
        this._similarIndex = -1;
        this.canLeftFlex = mdata.canLeftFlex || false; // 可左扩展
        this.canRightFlex = mdata.canRightFlex || false; // 可右扩展
        this.isCalculate = false; // 是否已经完成约束计算
    }

    set(prop, value) {
        this["_" + prop] = value;
        // this._mdata[prop] = value;
    }
    toJSON() {
        return {
            "id": this.id,
            "parentId": this._parentId,
            "type": this._type,
            "modelName": this._modelName,
            "abX": this._abX,
            "abY": this._abY,
            "width": this.width,
            "height": this.height,
            "abXops": this._abXops,
            "abYops": this._abYops,
            "zIndex": this._zIndex,
            "constraints": Object.assign({}, this._constraints),
            "children": this._children.map(child => child.toJSON()),
            "canLeftFlex": this.canLeftFlex,
            "canRightFlex": this.canRightFlex,
            "similarIndex": this.similarIndex,
            "isCalculate": this.isCalculate,
        }
    }
    get parentId() {
        return this._parentId;
    }
    get similarIndex() {
        return this._similarIndex;
    }

    get type() {
        return this._type;
    }

    get modelName() {
        return this._modelName;
    }

    get abX() {
        return this._abX;
    }

    get abY() {
        return this._abY;
    }

    get abXops() {
        return this._abXops;
    }

    get abYops() {
        return this._abYops;
    }
    get width() {
        return this._abXops - this._abX;
    }
    get height() {
        return this._abYops - this._abY;
    }

    get zIndex() {
        return this._zIndex;
    }

    get constraints() {
        return this._constraints;
    }

    get children() {
        return this._children;
    }
}
Tree.createNodeData = function (mdata) {
    return new Node(mdata);
}


module.exports = {
    join,
    Tree
}