// 此模块定义了元素模型及组件模型的构造类
// 并提供dsl模块model使用的对外接口
const Common = require('./dsl_common.js');

/**
 * 元素模型基础类
 */
class ElementModel {
    /**
     * @param {String} 组件模型的名称
     * @param {Int} textNum 组成模型的文本节点的数量
     * @param {Int} iconNum 组成模型的icon节点的数量
     * @param {Int} imageNum 组成模型的图片节点的数量
     * @param {Int} shapeNum 组成模型的图形节点的数量
     * @param {Int} priority 模型的优先级
     * @param {String} modelType 模型的类别
     */
    constructor(name, textNum, iconNum, imageNum, shapeNum, priority, modelType) {
        // 元素模型的基础属性
        this._name = name;
        this._textNum = textNum? textNum : 0;
        this._iconNum = iconNum? iconNum : 0;
        this._imageNum = imageNum? imageNum : 0;
        this._shapeNum = shapeNum? shapeNum : 0;
        this._elementNum = this._textNum + this._iconNum + this._imageNum + this._shapeNum;
        this._priority = priority? priority : Common.LvD;          // 优先级越大就越先进行匹配 
        this._modelType = modelType? modelType : null;             // 用于组合时的计算

        // 当传进节点进行匹配时节点属性的记录
        this._nodes = null;                                        // 需要进行匹配的元素
        this._nodeTexts = null;                                    // 匹配的元素中文字元素
        this._nodeIcons = null;                                    // 匹配的元素中Icon元素
        this._nodeImages = null;                                   // 匹配的元素中图片元素
        this._nodeShapes = null;                                   // 匹配的元素中图形元素
        this._mainNode = null;                                     // 用于这个模型的主节点, 因为位置基于主节点来计算
        this._matchNodes = {};                                     // 用于记录模板中对应的节点, 以通过key-value的形式返回匹配到的节点

        // 元素模型的基础属性
        // 这些属性通过传进的节点计算而来, 用于组件模型匹配时的再计算
        this.id = null;                                            // 用于匹配删减时用到
        this.type = this._modelType;                               // 模型的类型
        this.x = 0;                                                // x坐标
        this.y = 0;                                                // y坐标
        this.abX = 0;                                              // 基于原点的x坐标
        this.abY = 0;                                              // 基于原点的y坐标
        this.width = 0;                                            // 宽度
        this.height = 0;                                           // 高度
        this.abXops = 0;                                           // 对角坐标x
        this.abYops = 0;                                           // 对角坐标y

        // 模型空间是否可左右扩展
        this.canLeftFlex = false;
        this.canRightFlex = false;    
    }

    /**
     * 将传进来匹配的节点做分类处理并生成各计算参数
     * @param {Array} nodes 需要匹配的节点
     * @return 
     */
    _initMatchNode(nodes) {
        this._nodes = nodes;
        this._nodeTexts = [];
        this._nodeIcons = [];
        this._nodeImages = [];
        this._nodeShapes = [];
        this._mainNode = null;
        this._matchNodes = {};
        
        nodes.forEach(item => {
            switch(item.type) {
                case Common.QText:
                    this._nodeTexts.push(item);
                    break;
                case Common.QIcon:
                    this._nodeIcons.push(item);
                    break;
                case Common.QImage:
                    this._nodeImages.push(item);
                    break;
                case Common.QShape:
                    this._nodeShapes.push(item);
                    break;
                default:;
            }
        });

        // 模型被匹配时需要再用到的参数
        this._initMatchParam(nodes);
    }

    /**
     * 通过匹配的节点生成的参与组件匹配的参数
     * @param {Array} nodes 匹配的节点 
     */
    _initMatchParam(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            if (i == 0) {
                this.abX = nodes[i].abX;
                this.abY = nodes[i].abY;
                this.abXops = nodes[i].abX + nodes[i].width;
                this.abYops = nodes[i].abY + nodes[i].height;
            }
            else {
                // 比较大小得出这个组件的大小
                this.abX = (this.abX < nodes[i].abX)? this.abX : nodes[i].abX;
                this.abY = (this.abY < nodes[i].abY)? this.abY : nodes[i].abY;
                this.abXops = (this.abXops < nodes[i].abX + nodes[i].width)? nodes[i].abX + nodes[i].width : this.abXops;
                this.abYops = (this.abYops < nodes[i].abY + nodes[i].height)? nodes[i].abY + nodes[i].height : this.abYops;
            }

            // 计算宽高
            this.width = Math.abs(this.abXops - this.abX);
            this.height = Math.abs(this.abYops - this.abY);
        }
    }

    /**
     * 各模型实现,用于区分各元素的逻辑实现
     * 方便后面做规则的判断
     */
    _initNode() {
        
    }

    /**
     * 是否与组件模型匹配
     * @param nodes 需要匹配的元素
     * @returns {Boolean}
     */
    isMatch(nodes) {
        // 把传进的节点做个简单记录和处理
        this._initMatchNode(nodes);
        this._initNode();

        let result = false;
        // 匹配的方式是通过自定义多个规则的regular函数来得出是否匹配
        // 这里先hardcode定义最多20个规则，而且这20个规则是 && 的关系
        // 以后再考虑是否拓展支持 || 关系
        for (let i = 1; i <= 20; i++) {
            if (this['regular' + i]) {
                result = this['regular' + i].apply(this);
                if (!result) {  // 只要有一个不返回true
                    break;
                }
            }
            else {
                break;
            }
        }

        if (result == true) {
            // 如果匹配成功则给node做一个记号
            nodes.forEach(nd => {
                nd['isMatched'] = true;
                
                if (nd._nodeData && nd._nodeData['1']) {
                    // 复合元素模型
                    nd['modelName'] = nd.modelName;
                }
                else {
                    nd['modelName'] = this.getName();
                }

                // !重要,扩展出node的左扩展, 右扩展属性
                nd['canLeftFlex'] = this.canLeftFlex;
                nd['canRightFlex'] = this.canRightFlex;
            });
        }

        return result;
    }

    /**
     * 设置基础模型组合里的主节点
     * 用于combine规则计算时使用
     * @param {Node} node 主节点 
     */
    setMainNode(node) {
        if (!node) {
            return;
        }
        node.isMainNode = true;
    }

    /**
     * 获取模型的id
     */
    getModelId() {
        return this.id;
    }

    /**
     * 获取这个组件的名称
     * @returns {String} 返回组件名称
     */
    getName() {
        return this._name;
    }

    /**
     * 获取这个组件的优先级
     * @returns {Int} 返回该组件模型的优先级
     */
    getPriority() {
        return this._priority;
    }

    /**
     * 获取基础组件的type, 用于组合成Combine时用
     * @returns {BaseModel.Type}
     */
    getModelType() {
        return this._modelType;
    }

    /**
     * 获取模型X坐标
     * @returns
     */
    getX() {
        return this.x;
    }

    /**
     * 获取模型Y坐标
     * @returns
     */
    getY() {
        return this.y;
    }

    /**
     * 获取模型基于原点X坐标
     * @returns
     */
    getAbX() {
        return this.abX;
    }

    /**
     * 获取模型基于原点Y坐标
     * @returns
     */
    getAbY() {
        return this.abY;
    }

    /**
     * 获取对角基于原点的X坐标
     * @returns
     */
    getAbXops() {
        return this.abXops;
    }

    /**
     * 获取对角基于原点的Y坐标
     * @returns
     */
    getAbYops() {
        return this.abYops;
    }

    /**
     * 获取模型宽度
     * @returns
     */
    getWidth() {
        return this.width;
    }

    /**
     * 获取模型高度
     * @returns
     */
    getHeight() {
        return this.height;
    }

    /**
     * 获取这个组件的元素数量
     * @returns {Int} 返回该组件模型的元素个数
     */
    getNumber() {
        return this._elementNum;
    }

    /**
     * 获取这个组件的文本元素数量
     * @returns {Int}
     */
    getTextNumber() {
        return this._textNum;
    }

    /**
     * 获取这个组件的Icon元素数量
     * @returns {Int}
     */
    getIconNumber() {
        return this._iconNum;
    }

    /**
     * 获取这个组件的图片元素数量
     * @returns {Int}
     */
    getImageNumber() {
        return this._imageNum;
    }

    /**
     * 获取这个组件的图形元素数量
     * @returns {Int}
     */
    getShapeNumber() {
        return this._shapeNum;
    }

    /**
     * 获取传进来要匹配的元素
     * @returns {Array}} 返回需要匹配的元素
     */
    getNodes() {
        return this._nodes;
    }

    /**
     * 从匹配的节点中刷选出QText元素
     * @returns {Array} text数组
     */
    getTextNodes() {
        return this._nodeTexts;
    }

    /**
     * 从匹配的节点中刷选出QIcon元素
     * @returns {Array} text数组
     */
    getIconNodes() {
        return this._nodeIcons;
    }

    /**
     * 从匹配的节点中刷选出QImage元素
     * @returns {Array} image数组
     */
    getImageNodes() {
        return this._nodeImages;
    }

    /**
     * 从匹配的节点中刷选出QShape元素
     * @returns {Array} image数组
     */
    getShapeNodes() {
        return this._nodeShapes;
    }

    /**
     * 返回匹配到的根据模板键值储存的信息
     */
    getMatchNode() {
        return this._matchNodes;
    }
} 

/**
 * 组件模型基础类
 */
class WidgetModel extends ElementModel {
    /**
     * @param {String} 组件模型的名称
     * @param {Int} textNum 组成模型的文本节点的数量
     * @param {Int} iconNum 组成模型的icon节点的数量
     * @param {Int} imageNum 组成模型的图片节点的数量
     * @param {Int} shapeNum 组成模型的图形节点的数量
     * @param {Int} priority 模型的优先级
     * @param {String} modelType 模型的类别
     */
    constructor(name, textNum, iconNum, imageNum, shapeNum, priority, modelType) {
        // 定义一个组件模型的基础属性
        super(name, textNum, iconNum, imageNum, shapeNum, priority, modelType);
    }
}

/**
 * 用于布局分析的模型基类
 */
class LayoutModel {
    /**
     * 布局的类型
     * @param {Int} modelType 
     */
    constructor(modelType) {
        this._modelType = modelType;
    }

    /**
     * 判断是横排还是
     * @param {Node} nodes 子元素
     * @return {Boolean}
     */
    _isVerticalLayout(nodes) {
        let result = true;

        if (nodes.length == 1) {
            return result;
        }
        // 子节点不相交即为竖排
        for (let i = 1; i < nodes.length; i++) {
            let preNode = nodes[i - 1];
            let curNode = nodes[i];
            
            // 等于也可能是竖排
            if (curNode.abY < preNode.abYops) {
                result = false;
                break;
            }
        }

        return result;
    }

    /**
     * 对传进来的模型数组进行处理
     * @param {TreeNode} parent 树节点
     * @param {Array} nodes 树节点数组
     * @param {Array} models 对应的模型数组
     * @param {Int} layoutType 布局的类型
     */
    handle(parent, nodes, models, layoutType) {

    }
}

/**
 * 用于元素模型及组件模型匹配的数据结构化储存类
 */
class MatchData {
    /**
     * 从匹配的模型中获取模型信息及节点信息,进行结构化储存和输出
     * @param {Object} model 模型数据,ElementModel或WidgetModel 
     */
    constructor(model) {
        // 这些属性通过传进的模型计算而来, 用于组件模型匹配时的再计算
        this.id = null;                                           // id标识
        this.type = null;                                         // 模型类型
        this.x = 0;                                               // x坐标
        this.y = 0;                                               // y坐标
        this.abX = 0;                                             // 基于原点的x坐标
        this.abY = 0;                                             // 基于原点的y坐标
        this.width = 0;                                           // 宽度
        this.height = 0;                                          // 高度
        this.abXops = 0;                                          // 对角坐标x
        this.abYops = 0;                                          // 对角坐标y
        
        // 数据构成的记录
        this.modelType = null;                                    // 模型的类型
        this.modelName = null;                                    // 模型的名称
        // 是否可左右扩展
        this.canLeftFlex = false;
        this.canRightFlex = false;
        // 相似性标识
        this.similarId = null;                                    

        // 节点数据的储存形式, 把节点信息组织起来
        this._nodeData = {};



        // !重要, this.data = [] 这里会准备删除
        // res = {modelName: 'xxx', nodes: [Node, Node, Node, ...]}
        // this.data = [res, res, res, ...];
        this.data = [];
        
        this._addData(model);
    }

    /**
     * 添加数据
     * @param {Object} model 元素模型或组件模型
     */
    _addData(model) {
        if (!model) {
            return;
        }

        if (model.getModelType() == Common.QWidget) {
            this._addWidgetData(model);
        }
        else {
            this._addElementData(model);
        }
    }

    /**
     * 增加元素模型数据
     * @param {Object} model 元素模型
     */
    _addElementData(model) {
        this._initMatchParam(model);

        let nodeData = model.getMatchNode();
        // 元素模型只需直接赋值
        this._nodeData = nodeData;
        // console.log(this._nodeData);
        // console.log('++++++++++++++++++');
        let res = {};
        res.modelId = model.getModelId();
        res.modelName = model.getName();
        res.nodes = model.getNodes();
        this.data.push(res);
    }

    /**
     * 增加组件模型数据
     * @param {Object} model 组件模型 
     */
    _addWidgetData(model) {
        this._initMatchParam(model);
        // getNodes获取到的是MatchData(Element), 因为Widget是通过MatchData去匹配的
        let matchDatas = model.getMatchNode();
        
        for (let key in matchDatas) {
            let md = matchDatas[key];
            let nodeData = md.getMatchNode();

            if (nodeData['1']) {    // 符合模型的话直接传混合的MatchData
                this._nodeData[key] = md;
                //console.log(md);
            }
            else {
                this._nodeData[key] = nodeData['0'];
            }
        }

        // 后续优化掉
        let mds = model.getNodes();
        //console.log(mds);
        mds.forEach(md => {
            let res = {};
            res.modelId = md.id;
            res.modelName = md.modelName;
            res.nodes = md.getOriginData();
            this.data.push(res);
        });
    }

    /**
     * 通过匹配的模型生成MatchData的各参数
     * @param {Object} model 匹配中的模型
     */
    _initMatchParam(model) {
        // 默认暂时这里只使用第一个节点的id和标识, c是一个特别标识, 因为暂没id生成程序
        this.id = model.getNodes()[0].id + 'c';                 
        this.x = model.getX();
        this.y = model.getY();
        this.abX = model.getAbX();
        this.abY = model.getAbY();
        this.abXops = model.getAbXops();
        this.abYops = model.getAbYops();
        this.width = model.getWidth();
        this.height = model.getHeight();

        this.type = model.getModelType();
        this.modelType = model.getModelType();
        this.modelName = model.getName();
        this.canLeftFlex = model.canLeftFlex;
        this.canRightFlex = model.canRightFlex;
        this.similarId = model.similarId;
    }

    /**
     * 重要,MatchData数据相似性的判断
     * @param {MatchData} matchData 用于比较的MatchData
     */
    isSimilar(matchData) {
        
    }

    /**
     * 返回匹配的模型的类型
     */
    getModelType() {
        return this.modelType;
    }

    /**
     * 返回匹配的模型的名称
     */
    getModelName() {
        return this.modelName;
    }

    /**
     * 返回MatchData中储存的结构化数据,this.data数组
     */
    getOriginData() {
        return this.data;
    }

    /**
     * 获取MatchData计算出的高度
     */
    getHeight() {
        return this.height;
    }

    /**
     * 返回经过处理的data数据,一维数组, 
     * 因为this.data是一个数组嵌套,然后节点信息也在里面,想简单使用需要进行返回处理
     * 格式:
     * [{
     *      sign: 'wg2-m1|em1-m1',              // 匹配演化的标识, 可用于回溯数据
     *      modelName: xxx,                     // 模型名称
     *      modelType: xxx,                     // 模型类别
     *      id: xxx,                            // 节点id
     *      nodeName: xxx                       // 节点名称
     * }]
     */
    getSimpleDataInLinearArray() {
        let result = [];
        this.data.forEach(item => {
            // 计算标识并寻找节点信息
            if (this.modelType == Common.QWidget) { 
                // 组件模型this.data储存的是MatchData格式
                // item参见addWidgetData的处理
                item.nodes.forEach(md => {
                    md.nodes.forEach(nd => {
                        let res = {};
                        res.modelName = this.getModelName();
                        res.modelType = this.getModelType();
                        res.sign = res.modelName + '|' + md.modelName;
                        res.id = nd.id;
                        res.nodeName = nd.name;

                        result.push(res);
                    });
                });
            }
            else { 
                // 元素模型
                // item为{modelName:xxx, nodes: []}形式
                // console.log(item);
                item.nodes.forEach(nd => {
                    let res = {};
                    res.modelName = item.modelName;
                    res.modelType = nd.type;
                    res.sign = 'element' + '|' + res.modelName;
                    res.id = nd.id;
                    res.nodeName = nd.name;

                    result.push(res);
                });
            }
        });

        return result;
    }

    // 获取
    getMatchNode() {
        return this._nodeData;
    }
}

// 对外接口
module.exports = {
    ElementModel,
    WidgetModel,
    LayoutModel,
    MatchData
}