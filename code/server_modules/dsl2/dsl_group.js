const Common = require('./dsl_common.js');
const Utils = require('./dsl_utils.js');

/**
 * 将组件进行排版布局
 * @param {Array} widgetModels 进行布局的组件模型
 * @param {Array} elementModels 进行布局的元素模型
 * @returns {Object} 返回结构树
 */
let join = function(widgetModels, elementModels) {
    if (!widgetModels && !elementModels) {
        return null;
    }
    let tree = new Tree();          // dsl树

    // 把QText和QIcon从elementModels中抽离
    let elements = [];
    elementModels.forEach(item => {
        if (item.getModelType() == Common.QText || item.getModelType() == Common.QIcon) {
            widgetModels.push(item);
        }
        else {
            elements.push(item);
        }
    });

    // elements通过面积排序从大往小排序
    Utils.sortListByArea(elements);
    
    // element中都是QShape和QImage, 先进行添加
    elements.forEach(ele => {
        tree._addNode(ele);
    });

    // 添加widget
    widgetModels.forEach(wg => {
        tree._addNode(wg);
    });
    // 创建layers
    tree._groupNode();

    return tree;
}

/**
 * DSL树的构建类,用于生成和输出标准数据
 */
class Tree {
    constructor() {
        // 节点树
        this._treeData = Tree.createNodeData();
        this._treeData.type = Common.QBody;
        this._treeData.width = Common.DesignWidth;
        this._treeData.abXops = Common.DesignWidth;
        this._treeData.isCalculate = true;
        this._treeData.asBackground = true;
        
        // 组件模型信息储存
        this._modelData = {};
        // 布局模型信息储存
        this._layoutData = {};
        // 布局形式
        this._layoutType = null;
    }

    // 组成包含关系的节点
    _add(parent, mdata) {
        let children = parent.children;

        // 这里先给一个临时标识,在判断包含关系时有需要
        if (mdata.width >= parent.width
            && (mdata.type == Common.QImage || mdata.type == Common.QShape)) {
            // 假如加入的节点的宽度大于等于父节点的宽度, 则有可能作为节点
            mdata._asBackground = true;
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
                }
                else {
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
        }
        else {
            // 直接添加进parent
            let node = Tree.createNodeData(mdata);
            node.parentId = parent.id;
            children.push(node);
        }
    }

    // 创建QLayer
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
    
        // 进行成组计算
        if (children.length == 1) {
            // 当只包含一个元素时就不用创建QLayer
            return;
        }

        // 节点再次成组遵循从上到下, 从左到右的编写代码逻辑
        let layers = Utils.groupByYaxis(children); 
        Utils.sortListByParam(layers, 'minY');          // 从上往下

        let newChildren = [];
        layers.forEach(arr => {
            if (arr.length == 1) {
                // 当横排的节点只有一个时, 如果它的宽度已经等于大于父元素宽度,(QShape, QImage, QWidget)
                // 则直接作为QLayer排版了, 否则创建一个QLayer用于包含节点
                let child = arr[0];
                if (child.width >= parent.width) {
                    newChildren.push(child);
                }
                else {
                    newChildren.push(child);
                }
            } 
            else {      // 多个节点情况
                Utils.sortListByParam(arr, 'abX');      // 从左至右

                let node = Tree.createNodeData();
                node.parentId = parent.id;
                node.width = parent.width;
                node.height = arr.maxY - arr.minY;
                node.abX = 0;
                node.abY = arr.minY;
                node.abXops = node.width;
                node.abYops = node.abY + node.height;

                arr.forEach(child => {
                    child.parentId = node.id;
                    node.children.push(child);
                });
                newChildren.push(node);
            }
        });

        // 替换原来的结构
        parent.children = newChildren;
    }

    /**
     * 添加元素节点
     * @param {MatchData} mdata 
     */
    _addNode(mdata) {
        if (!mdata) {
            return;
        }

        this.setModelData(mdata);               // 记录模型信息
        this._add(this._treeData, mdata);
    }

    /**
     * 对节点进行成组排版
     */
    _groupNode() {
        this._group(this._treeData);
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
        return this._treeData;
    }

    //
    getLayoutType() {
        return this._layoutType;
    }
}

Tree.LayerId = 0;

Tree.createNodeData = function(mdata) {
    // 节点储存的数据
    let obj = {
        parentId: null,             // 父节点id
        id: null,                   // id值
        type: Common.QLayer,        // 默认用于布局
        modelName: 'layer',         // 模型的模型名
        x: 0,                       // x坐标
        y: 0,                       // y坐标
        abX: 0,                     // 基于原点的x坐标
        abY: 0,                     // 基于原点的y坐标
        abXops: 0,                  // 基于原点的x坐标对角
        abYops: 0,                  // 基于原点的y坐标对角
        width: 0,                   // 节点宽
        height: 0,                  // 节点高
        asBackground: false,        // 是否作为背景节点
        canLeftFlex: false,         // 可左扩展
        canRightFlex: false,        // 可右扩展
        isCalculate: false,         // 是否已经完成约束计算
        constraints: {},            // 添加的约束
        children: []                // 子节点
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
        obj.asBackground = mdata._asBackground? true : false;
    }
    else {
        obj.id = 'layer' + Tree.LayerId;
        Tree.LayerId++;
    }

    return obj;
}


module.exports = {
    join,
    Tree
}
