const Common = require('./dsl_common.js');
const Utils = require('./dsl_utils.js');
const Model = require('./dsl_model.js');

// DSLTree唯一实例
let dslTree = null;

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
    dslTree = new Tree(); // dsl树
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

        // 分解行
        let layers = Utils.gatherByLogic(children, function (a, b) {
            // return Utils.isYConnect(a, b, 0);
            // return Utils.isYWrap(a,b);
            // 如果a节点层级高于b，切a节点位置高于b，则为一组（a为绝对定位）
            if (a._zIndex > b._zIndex && a._abY < b._abY) {
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
        // renderData通过递归节点树来获取
        let renderData = this._treeData.getRenderData();        // 获取根元素
        this._parseRenderData(renderData, this._treeData);
        return renderData;
    }

    /**
     * 通过TreeNode解析出Render数据
     * @param {*} renderData 
     * @param {*} treeNode 
     */
    _parseRenderData(renderData, treeNode) {
        if (treeNode.children.length == 0) {
            return;
        }

        for (let i = 0; i < treeNode.children.length; i++) {
            let node = treeNode.children[i];
            let rdata = node.getRenderData();
            renderData.children.push(rdata);

            if (node.children.length > 0) {
                this._parseRenderData(rdata, node);
            }
        }
    }    

    /**
     * // 准备废弃
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


/**
 * DSL Tree节点类
 */
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
        this._constraints = {}; // 添加的约束
        this._mdata = mdata;
        this._similarIndex = -1;
        this.canLeftFlex = mdata.canLeftFlex || false; // 可左扩展
        this.canRightFlex = mdata.canRightFlex || false; // 可右扩展
        this.isCalculate = false; // 是否已经完成约束计算
        this._zIndex = mdata.zIndex || -1;
        // this._children = mdata.children || [];
        this.set('children', mdata.children || []);// 子节点
        
        // RenderData的处理
        this._renderData = null;
        this._initRenderData();
    }

    /**
     * 从MatchNode中解析出RenderData数据
     */
    _initRenderData() {
        // !重要,从MatchData生成的render,
        // Qlayer, QBody 没有MatchData
        this._renderData = new RenderData();

        // 最外层信息直接通过node信息获取
        this._renderData.set('parentId', this._parentId);
        this._renderData.set('id', this._id);
        this._renderData.type = this._type;
        this._renderData.modelName = this._modelName;
        this._renderData.abX = this._abX;
        this._renderData.abY = this._abY;
        this._renderData.abXops = this._abXops;
        this._renderData.abYops = this._abYops;
        this._renderData.width = this._width;
        this._renderData.height = this._height;
        this._renderData.canLeftFlex = this.canLeftFlex;
        this._renderData.canRightFlex = this.canRightFlex;
        this._renderData.isCalculate = this.isCalculate;
        this._renderData.constraints = this._constraints;
        this._renderData.zIndex = this._zIndex;

        // 如果有MatchData, 则进行解析处理
        if (!this._mdata || this._mdata === {}) {
            let jsonNode = this._mdata.getMatchNode();
            this._handleMatchNodeData(this._renderData, jsonNode);
        }
    }

    /**
     * 通过matchData赋值给renderData
     * @param {RenderData} renderData 
     * @param {Model.MatchData} matchData 
     */
    _initRenderDataWithMatchData(renderData, matchData) {
        renderData.id = matchData.id;
        renderData.type = matchData.type;
        renderData.modelName = matchData.modelName;
        renderData.abX = matchData.abX;
        renderData.abY = matchData.abY;
        renderData.abXops = matchData.abXops;
        renderData.abYops = matchData.abYops;
        renderData.width = matchData.width;
        renderData.height = matchData.height;
        renderData.canLeftFlex = matchData.canLeftFlex;
        renderData.canRightFlex = matchData.canRightFlex;
        renderData.zIndex = matchData.zIndex;
    }

    /**
     * 递归解析MatchData的getMatchNode数据
     */
    _handleMatchNodeData(parent, jsonNode) {
        if (!jsonNode ) {
            return;
        }

        // 如果是单节点则直接往parent上添加属性
        if (jsonNode['0'] && !jsonNode['1']) {
            parent.text = jsonNode['0'].text? jsonNode['0'].text : '';
            parent.path = jsonNode['0'].path? jsonNode['0'].path : null;
            parent.style = jsonNode['0'].style? jsonNode['0'].style : {};
            parent.modelRef = '0';
            return;
        }

        for(key in jsonNode) {
            let json = jsonNode[key];
            let renderData = new RenderData();
            renderData.parentId = parent.id;
            renderData.modelRef = key;

            parent.children.push(renderData);

            // 递归进复合模型
            if (json instanceof Model.MatchData) {
                let anotherJson = json.getMatchNode();
                this._initRenderDataWithMatchData(renderData, json);
                this._handleMatchNodeData(renderData, anotherJson);
            }

            // 根据json的modelName获取对应的MatchData来赋值
            // 重要 !这里待完善
            // 已经是叶节点, 可以取designjson中的信息
            renderData.id = json.id;
            renderData.type = json.type;
            renderData.abX = json.abX;
            renderData.abY = json.abY;
            renderData.abXops = json.abX + json.width;
            renderData.abYops = json.abY + json.height;
            renderData.width = json.width;
            renderData.height = json.height;
            renderData.modelName = '';              // !重要,因为已经是叶节点,所以取消了modelName, Render模块需要用来辨识
            renderData.text = json.text? json.text : '';
            renderData.path = json.path? json.path : null;
            renderData.style = json.style? json.style : {};
        }
    }

    set(prop, value) {
        this["_" + prop] = value;
        if (prop == 'children' && this._zIndex == -1) {
            // if (parent.id == 'layer0') debugger;
            this._zIndex = this._children.length ? Math.min(...this._children.map(nd => nd.zIndex)) : -1;
        }
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

    /**
     * 获取通过MatchData构建的RenderData数据
     * @return {Object}
     */
    getRenderData() {
        return this._renderData;
    }
}

/**
 * 从DSL Tree返回的统一render数据格式
 */
class RenderData {
    constructor() {
        this._parentId = '';
        this._id = '';
        this._type = '';
        this._modelName = '';
        this._modelRef = null;
        this._abX = 0;
        this._abY = 0;
        this._abXops = 0;
        this._abYops = 0;
        this._width = 0;
        this._height = 0;
        this._canLeftFlex = false;
        this._canRightFlex = false;
        this._isCalculate = false;
        this._constraints = {};
        this._zIndex = 0;
        this._text = '';
        this._path = '';
        this._style = {};
        
        this.children = [];
    }

    set(key, value) {
        this["_" + key] = value;
    }

    get parentId() {
        return this._parentId;
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get modelName() {
        return this._modelName;
    }

    get modelRef() {
        return this._modelRef;
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
        return this._width;
    }

    get height() {
        return this._height;
    }

    get canLeftFlex() {
        return this._canLeftFlex;
    }

    get canRightFlex() {
        return this._canRightFlex;
    }

    get isCalculate() {
        return this._isCalculate;
    }

    get constraints() {
        return this._constraints;
    }

    get zIndex() {
        return this._zIndex;
    }

    get text() {
        return this._text;
    }

    get path() {
        return this._path;
    }

    get style() {
        return this._style;
    }
}


// 创建树节点
Tree.createNodeData = function (mdata) {
    return new Node(mdata);
}

/**
 * 根据传进的nodes,创建返回的新node
 * @param {Array} nodesArr
 * @parent {Int} similarId
 * @return {Object}
 */
Tree.createCycleData = function(nodesArr, similarId) {
    // 组成新节点,并且构建MatchData里的getMatchNode数据
    if (!nodesArr || nodesArr.length == 0) {
        return;
    }
    
    // 构建循环结构的根节点
    let newNode = new Node();
    newNode.modelName = 'cycle';

    nodesArr.forEach(nodes => {
        if (!nodes || nodes.length == 0) {
            
        }

        
    });
}

// 创建DSLTree渲染节点数据
Tree.createRenderData = function() {
    return new RenderData();
}


module.exports = {
    join,
    Tree,
    RenderData
}