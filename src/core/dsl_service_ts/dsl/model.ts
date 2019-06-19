// 此模块定义了元素模型及组件模型的构造类
// 并提供dsl模块model使用的对外接口
import crypto from 'crypto';
import Common from './common';
import Feature from './feature';

/**
 * 元素模型组件模型基类
 */
class BaseModel {
  _textNum: number;

  _iconNum: number;

  _imageNum: number;

  _shapeNum: number;

  _elementNum: any;

  _nodes: any[];

  _nodeTexts: any[];

  _nodeIcons: any[];

  _nodeImages: any[];

  _nodeShapes: any[];

  _matchNodes: {};

  id: any;

  type: string;

  modelName: string;

  x: number;

  y: number;

  abX: number;

  abY: number;

  width: number;

  height: number;

  abXops: number;

  abYops: number;

  zIndex: number;

  priority: number;

  canLeftFlex: any;

  canRightFlex: any;

  /**
   * @param {String} name 组件模型的名称
   * @param {Int} textNum 组成模型的文本节点的数量
   * @param {Int} iconNum 组成模型的icon节点的数量
   * @param {Int} imageNum 组成模型的图片节点的数量
   * @param {Int} shapeNum 组成模型的图形节点的数量
   * @param {Int} priority 模型的优先级
   * @param {String} modelType 模型的类别
   */
  constructor(
    name: string,
    textNum: number,
    iconNum: number,
    imageNum: number,
    shapeNum: number,
    priority: number,
    modelType: string,
  ) {
    // 元素模型的基础属性
    this._textNum = textNum || 0;
    this._iconNum = iconNum || 0;
    this._imageNum = imageNum || 0;
    this._shapeNum = shapeNum || 0;
    this._elementNum =
      this._textNum + this._iconNum + this._imageNum + this._shapeNum;

    // 当传进节点进行匹配时节点属性的记录
    this._nodes = []; // 需要进行匹配的元素
    this._nodeTexts = []; // 匹配的元素中文字元素
    this._nodeIcons = []; // 匹配的元素中Icon元素
    this._nodeImages = []; // 匹配的元素中图片元素
    this._nodeShapes = []; // 匹配的元素中图形元素
    this._matchNodes = {}; // 用于记录模板中对应的节点, 以通过key-value的形式返回匹配到的节点

    // 元素模型的基础属性
    // 属性通过传进的节点计算而来, 用于组件模型匹配时的再计算
    this.id = null; // 用于匹配删减时用到
    this.type = modelType || null; // 模型的类型
    this.modelName = name; // 模型的名称
    this.x = 0; // 在设计稿的x坐标, 这里都先不用处理
    this.y = 0; // 在设计稿的y坐标, 这里都先不用处理
    this.abX = 0; // 基于原点的x坐标
    this.abY = 0; // 基于原点的y坐标
    this.width = 0; // 宽度
    this.height = 0; // 高度
    this.abXops = 0; // 对角坐标x
    this.abYops = 0; // 对角坐标y
    this.zIndex = 0; // 显示层级
    this.priority = priority || Common.LvD; // 优先级越大就越先进行匹配

    // 模型空间是否可左右扩展, 默认不赋值
    this.canLeftFlex = null;
    this.canRightFlex = null;
  }

  /**
   * 将传进来匹配的节点做分类处理并生成各计算参数
   * @param {Array} nodes 需要匹配的节点
   */
  _initMatchNode(nodes: any[]) {
    this._nodes = nodes || [];
    this._nodeTexts = [];
    this._nodeIcons = [];
    this._nodeImages = [];
    this._nodeShapes = [];
    this._matchNodes = {};

    nodes.forEach(nd => {
      switch (nd.type) {
        case Common.QText:
          this._nodeTexts.push(nd);
          break;
        case Common.QIcon:
          this._nodeIcons.push(nd);
          break;
        case Common.QImage:
          this._nodeImages.push(nd);
          break;
        case Common.QShape:
          this._nodeShapes.push(nd);
          break;
        default:
      }
    });

    // 模型被匹配时需要再用到的参数
    this._initMatchParam(nodes);
  }

  /**
   * 通过匹配的节点生成的参与组件匹配的参数
   * @param {Array} nodes 匹配的节点
   */
  _initMatchParam(nodes: any[]) {
    for (let i = 0; i < nodes.length; i++) {
      if (i === 0) {
        this.abX = nodes[i].abX;
        this.abY = nodes[i].abY;
        this.abXops = nodes[i].abX + nodes[i].width;
        this.abYops = nodes[i].abY + nodes[i].height;
        this.zIndex = nodes[i].zIndex; // 层级的设定
      } else {
        // 比较大小得出这个组件的大小
        this.abX = this.abX < nodes[i].abX ? this.abX : nodes[i].abX;
        this.abY = this.abY < nodes[i].abY ? this.abY : nodes[i].abY;
        this.abXops =
          this.abXops < nodes[i].abX + nodes[i].width
            ? nodes[i].abX + nodes[i].width
            : this.abXops;
        this.abYops =
          this.abYops < nodes[i].abY + nodes[i].height
            ? nodes[i].abY + nodes[i].height
            : this.abYops;
        // zIndex取最低那个
        this.zIndex =
          this.zIndex > nodes[i].zIndex ? nodes[i].zIndex : this.zIndex;
      }
    }

    this.width = Math.abs(this.abXops - this.abX);
    this.height = Math.abs(this.abYops - this.abY);
  }

  /**
   * 子类实现,
   * 匹配前对传进来的节点做处理
   */
  _initNode(): void {
    const that: any = this;
    return null;
  }

  /**
   * 子类实现
   * 当节点能与模型匹配时的处理
   */
  _whenMatched(): void {
    const that: any = this;
    return null;
  }

  /**
   * 给已匹配的元素做一个标识,防止重复匹配
   */
  _setMatchedNodeSign() {
    this._nodes.forEach(_nd => {
      const nd: any = _nd;
      nd.isMatched = true;
    });
  }

  /**
   * 是否与组件模型匹配
   * @param nodes 需要匹配的元素
   * @returns {Boolean}
   */
  isMatch(nodes: any[]): boolean {
    // 把传进的节点做个简单记录和处理
    this._initMatchNode(nodes);
    this._initNode();

    let result = false;
    const that: any = this;
    // 匹配的方式是通过自定义多个规则的regular函数来得出是否匹配
    // 这里先hardcode定义最多20个规则，而且这20个规则是 && 的关系
    // 以后再考虑是否拓展支持 || 关系
    for (let i = 1; i <= 20; i++) {
      if (that[`regular${i}`]) {
        result = that[`regular${i}`].apply(this);
        if (!result) {
          // 只要有一个不返回true
          break;
        }
      } else {
        break;
      }
    }

    if (result === true) {
      // 匹配了给一个标记
      this._setMatchedNodeSign();
      // 子模型执行
      this._whenMatched();
    }
    return result;
  }

  /**
   * 重置传进来的匹配节点的匹配标识
   */
  resetMatchedNodeSign() {
    this._nodes.forEach((_nd: any) => {
      const nd: any = _nd;
      nd.isMatched = false;
    });
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
   * @returns {Array}}
   */
  getNodes() {
    return this._nodes;
  }

  /**
   * 从匹配的节点中刷选出QText元素
   * @returns {Array}
   */
  getTextNodes() {
    return this._nodeTexts;
  }

  /**
   * 从匹配的节点中刷选出QIcon元素
   * @returns {Array}
   */
  getIconNodes() {
    return this._nodeIcons;
  }

  /**
   * 从匹配的节点中刷选出QImage元素
   * @returns {Array}
   */
  getImageNodes() {
    return this._nodeImages;
  }

  /**
   * 从匹配的节点中刷选出QShape元素
   * @returns {Array}
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

  /**
   * 返回通过模型生成的MatchData
   * @return {MatchData}
   */
  getMatchData() {
    return new MatchData(this);
  }
}

/**
 * 元素模型类
 */
class ElementModel extends BaseModel {
  /**
   * @param {String} name 组件模型的名称
   * @param {Int} textNum 组成模型的文本节点的数量
   * @param {Int} iconNum 组成模型的icon节点的数量
   * @param {Int} imageNum 组成模型的图片节点的数量
   * @param {Int} shapeNum 组成模型的图形节点的数量
   * @param {Int} priority 模型的优先级
   * @param {String} modelType 模型的类别
   */
  /* constructor(
    name: string,
    textNum: number,
    iconNum: number,
    imageNum: number,
    shapeNum: number,
    priority: number,
    modelType: string,
  ) {
    // 定义一个元素模型的基础属性
    super(name, textNum, iconNum, imageNum, shapeNum, priority, modelType);
  } */

  /**
   * 元素模型匹配成功
   */
  _whenMatched() {
    // 元素模型匹配的是designjson的数据, 所以this._nodes的数据格式是designjson
    this._nodes.forEach((_nd: any) => {
      const nd: any = _nd;
      // design的node节点没有abXops, abYops, canLeftFlex, canRightFlex属性, 顺带赋值
      nd.abXops = nd.abX + nd.width;
      nd.abYops = nd.abY + nd.height;

      switch (nd.type) {
        case Common.QText:
          nd.modelName = 'em1-m1';
          // nd.canLeftFlex = false;
          // nd.canRightFlex = true;
          break;
        case Common.QIcon:
          nd.modelName = 'em1-m2';
          nd.canLeftFlex = false;
          nd.canRightFlex = false;
          break;
        case Common.QImage:
          nd.modelName = 'em1-m3';
          nd.canLeftFlex = false;
          nd.canRightFlex = false;
          break;
        case Common.QShape:
          nd.modelName = 'em1-m4';
          nd.canLeftFlex = false;
          nd.canRightFlex = false;
          break;
        default:
      }
    });
  }
}

/**
 * 可变节点元素模型
 */
class ElementXModel extends BaseModel {
  _matchDatas: any[];

  /**
   * @param {String} name 组件模型的名称
   * @param {Int} textNum 组成模型的文本节点的数量
   * @param {Int} iconNum 组成模型的icon节点的数量
   * @param {Int} imageNum 组成模型的图片节点的数量
   * @param {Int} shapeNum 组成模型的图形节点的数量
   * @param {Int} priority 模型的优先级
   * @param {String} modelType 模型的类别
   */
  constructor(
    name: string,
    textNum: number,
    iconNum: number,
    imageNum: number,
    shapeNum: number,
    priority: number,
    modelType: string,
  ) {
    // 定义一个元素模型的基础属性
    super(name, textNum, iconNum, imageNum, shapeNum, priority, modelType);

    this._matchDatas = []; // 可变节点模型用于储存匹配了的MatchData数据
  }

  /**
   * 改写可变节点元素模型的返回匹配了的节点的方法
   * @returns {Array}}
   */
  getNodes() {
    if (this._matchDatas.length === 0) {
      return this._nodes;
    }

    this._matchDatas.forEach(mData => {
      const nds = mData.getMatchNode();
      nds.forEach((nd: any) => {
        this._nodes.push(nd);
      });
    });

    return this._nodes;
  }
}

/**
 * 组件模型类
 */
class WidgetModel extends BaseModel {
  /**
   * @param {String} 组件模型的名称
   * @param {Int} textNum 组成模型的文本节点的数量
   * @param {Int} iconNum 组成模型的icon节点的数量
   * @param {Int} imageNum 组成模型的图片节点的数量
   * @param {Int} shapeNum 组成模型的图形节点的数量
   * @param {Int} priority 模型的优先级
   * @param {String} modelType 模型的类别
   */
  /* constructor(
    name: string,
    textNum: number,
    iconNum: number,
    imageNum: number,
    shapeNum: number,
    priority: number,
    modelType: string,
  ) {
    // 定义一个组件模型的基础属性
    super(name, textNum, iconNum, imageNum, shapeNum, priority, modelType);
  } */
  /**
   * 组件模型匹配成功
   */
  // _whenMatched() {
  // 组件模型匹配进来的是MatchData, 所以this._nodes的数据是matchdata
  // }
}

/**
 * 自定义组件模型
 */
class SymbolModel {
  _symbolDatas: any[];

  _nowSymbolData: any;

  /**
   * @param {Array} symbolList 自定义组件列表, 里面是储存的Object数据 {id, json, md5, template, style}
   * @param {Array} ignoreList 忽略计算的属性
   */
  constructor(symbolList: any[], ignoreList: any) {
    if (!symbolList.length) {
      return;
    }

    // 自定义组件模型的数据列表
    this._symbolDatas = [];
    this._nowSymbolData = null; // 当前匹配到的自定义模型数据

    symbolList.forEach(symbol => {
      this._symbolDatas.push(
        new SymbolData(symbol.id, symbol.md5, symbol.template, symbol.style),
      );
    });
  }

  /**
   * 通过比较symbol与自身模型列表进行比较
   * @param {Json} symbol
   */
  isMatch(symbol: any) {
    const that: any = this;
    return false;
    /* this._nowSymbolData = null;

                let bool = false;
                if (!this._symbolDatas.length) {
                    return bool;
                }

                for (let i = 0; i < this._symbolDatas.length; i++) {
                    if (Feature.identityEqualWithMD5(symbol, this._symbolDatas[i].md5)) {
                        bool = true;
                        this._nowSymbolData = this._symbolDatas[i];
                        // 赋予属性
                        this._nowSymbolData.set('id', symbol.id);
                        this._nowSymbolData.set('type', Common.QSymbol);
                        this._nowSymbolData.set('modelName', 'symbol');
                        this._nowSymbolData.set('abX', symbol.abX);
                        this._nowSymbolData.set('abY', symbol.abY);
                        this._nowSymbolData.set('width', symbol.width);
                        this._nowSymbolData.set('height', symbol.height);
                        this._nowSymbolData.set('abXops', symbol.abX + symbol.width);
                        this._nowSymbolData.set('abYops', symbol.abY + symbol.height);
                        this._nowSymbolData.set('zIndex', symbol.zIndex);

                        // 复制symbol节点数据
                        if (symbol.children && symbol.children.length) {
                            symbol.children.forEach(node => {
                                this._nowSymbolData.nodes.push(node);
                            })
                        }

                        break;
                    }
                }
                return bool; */
  }

  /**
   * 返回Symbol的RenderData
   */
  getMatchData() {
    return new MatchData(this._nowSymbolData);
  }
}

/**
 * 用于布局分析的模型基类
 */
class LayoutModel {
  constructor() {}

  /**
   * 判断是横排还是
   * @param {Node} nodes 子元素
   * @return {Boolean}
   */
  static _isVerticalLayout(nodes: any) {
    let result = true;

    if (nodes.length === 1) {
      return result;
    }
    // 子节点不相交即为竖排
    for (let i = 1; i < nodes.length; i++) {
      const preNode = nodes[i - 1];
      const curNode = nodes[i];

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
  handle(parent: any, nodes: any, models: any, layoutType: any) {
    const that: any = this;
  }
}

/**
 * 用于元素模型及组件模型匹配的数据结构化储存类
 */
class MatchData {
  _matchNodes: any;

  id: any;

  type: any;

  modelName: any;

  x: any;

  y: any;

  abX: any;

  abY: any;

  abXops: any;

  abYops: any;

  width: any;

  height: any;

  canLeftFlex: any;

  canRightFlex: any;

  zIndex: any;

  similarParentId: any;

  similarId: any;

  data: any;

  /**
   * 获取匹配模型的数据进行储存
   * @param {Object} model 匹配的元素或组件模型或自定义组件模型(ElementModel, WidgetModel, SymbolData)
   */
  constructor(model: any) {
    this._init(model);

    if (model instanceof ElementModel || model instanceof WidgetModel) {
      // 传进来的是ElementModel或者WidgetModel, 元素模型和组件模型
      this._initWithModel(model);
      // 匹配了的节点数组
      this._matchNodes = model.getNodes();
    } else if (model instanceof SymbolData) {
      // 传进来的是SymbolData
      this._initWithSymbol(model);
    } else if (model instanceof ElementXModel) {
      // 传进来的是可变节点元素模型
      this._initWithXModel(model);
      // 匹配了的节点数组
      this._matchNodes = model.getNodes();
    }
  }

  /**
   * 初始化基础数据
   * @param {Object} model
   */
  _init(model: any) {
    this.id = null;
    this.type = model.type || null;
    this.modelName = model.modelName || 'no-model-name';
    this.x = model.x || 0;
    this.y = model.y || 0;
    this.abX = model.abX || 0;
    this.abY = model.abY || 0;
    this.abXops = model.abXops || 0;
    this.abYops = model.abYops || 0;
    this.width = model.width || 0;
    this.height = model.height || 0;
    this.canLeftFlex = model.canLeftFlex;
    this.canRightFlex = model.canRightFlex;
    this.zIndex = model.zIndex || 0;

    // 相似性标识
    this.similarParentId = null;
    this.similarId = null;
    this.data = null; // RenderData
  }

  /**
   * 根据Model构建MatchData
   * @param {BaseModel} model 匹配的元素或组件模型
   */
  _initWithModel(model: any) {
    // 默认暂时这里只使用第一个节点的id和标识, c是一个特别标识, 因为对id每特别需要
    this.id = `${model.getNodes()[0].id}-c` || null;
    // 生成this.data 数据
    if (model.type === Common.QWidget) {
      this._addWidgetData(model);
    } else {
      this._addElementData(model);
    }
  }

  /**
   * 根据SymbolData构建MatchData
   * @param {SymbolData} symbolData
   */
  _initWithSymbol(symbolData: any) {
    // 生成RenderData数据
    this.id = symbolData.id;
    this.type = symbolData.type;
    // 生成this.data数据
    this._addSymbolData(symbolData);
  }

  /**
   * 根据可变节点元素模型构建出MatchData
   * @param {ElementXModel} model
   */
  _initWithXModel(model: any) {
    // 临时处理
    // 默认暂时这里只使用第一个节点的id和标识, -ex是一个特别标识, 因为对id每特别需要
    this.id = `${model._matchDatas[0].id}-ex` || null;
    // 生成this.data数据
    this._addElementXData(model);
  }

  /**
   * 创建一个基础数值RenderData
   * @param {String} id 节点的id
   * @param {String} parentId 父节点的id
   * @param {String} modelName 模型的名称
   * @param {String} modelType 节点的类型
   * @param {Int} modelRef 节点属于第几个
   * @param {Object} data 数据
   */
  static _createRenderData(
    id: any,
    parentId: any,
    modelName: any,
    modelType: any,
    modelRef: any,
    data: any,
  ) {
    const renderData = new RenderData();
    renderData.set('id', id);
    renderData.set('parentId', parentId);
    renderData.set('type', modelType);
    renderData.set('modelName', modelName);
    renderData.set('modelRef', modelRef);
    renderData.set('modelId', id); // 默认modelId等于id

    renderData.set('abX', data.abX);
    renderData.set('abY', data.abY);
    renderData.set('abXops', data.abXops);
    renderData.set('abYops', data.abYops);
    renderData.set('width', data.width);
    renderData.set('height', data.height);
    renderData.set('canLeftFlex', data.canLeftFlex);
    renderData.set('canRightFlex', data.canRightFlex);
    renderData.set('zIndex', data.zIndex);

    return renderData;
  }

  /**
   * 从designjson获取更多数据
   * @param {RenderData} renderData 要补充属性的RenderData
   * @param {Object} nodeData 从节点匹配后的数据
   */
  _createFromElement(_renderData: any, _nodeData: any) {
    const renderData: any = _renderData;
    const nodeData: any = _nodeData;
    if (!nodeData['1']) {
      // 单节点
      const text = nodeData['0'].text || null;
      const path = nodeData['0'].path || null;

      renderData.set('text', text);
      renderData.set('path', path);
      renderData.set('type', nodeData['0'].type);
      renderData.set('styles', nodeData['0'].styles);
    } else {
      // nodes节点的记录
      renderData.nodes = {};

      // for (const key in nodeData) {
      Object.keys(nodeData).forEach((key: any) => {
        const nData: any = {};
        const tmpData = nodeData[key];
        nData['0'] = nodeData[key]; // 需要构造一个可以递归解析的数据, 只有一个节点

        const rData = MatchData._createRenderData(
          tmpData.id,
          renderData.id,
          tmpData.modelName,
          tmpData.type,
          key,
          tmpData,
        );
        // 继续获取designjson里的数据
        this._createFromElement(rData, nData);
        // renderData.children.push(rData);
        renderData.nodes[key] = rData;
      });
    }
  }

  /**
   * 从designjson获取更多数据
   * @param {RenderData} renderData 要补充属性的RenderData
   * @param {MatchData} matchData 从节点匹配后的数据
   */
  _createFromWidget(_matchData: any) {
    const renderData: any = this.data;
    const matchData: any = _matchData;
    if (!matchData['1']) {
      // 单节点
      const rData = matchData['0'].getRenderData();

      renderData.set('text', rData.text);
      renderData.set('path', rData.path);
      renderData.set('styles', rData.styles);
    } else {
      renderData.nodes = {};

      Object.keys(matchData).forEach((key: string) => {
        const rData = matchData[key].getRenderData();
        rData.set('parentId', renderData.id);
        rData.set('modelRef', key);
        // renderData.children.push(rData);
        renderData.nodes[key] = rData;
      });
    }
  }

  /**
   * 构建可变节点元素模型的RenderData数据
   * @param {RenderData} renderData
   * @param {Array<MatchData>} matchDatas
   */
  _createFromElementX(matchDatas: any) {
    const renderData: any = this.data;
    for (let i = 0; i < matchDatas.length; i++) {
      const mData = matchDatas[i];
      const rData = mData.getRenderData();
      rData.set('parentId', renderData.id);
      renderData.children.push(rData);
    }
  }

  /**
   * 增加元素模型数据
   * @param {BaseModel} model 元素模型
   */
  _addElementData(model: any) {
    // element拿到的是designjson
    const nodeData = model.getMatchNode();
    this.data = MatchData._createRenderData(
      this.id,
      null,
      this.modelName,
      this.type,
      null,
      model,
    );
    // 从designjson获取其它数据
    this._createFromElement(this.data, nodeData);
  }

  /**
   * 增加组件模型数据
   * @param {BaseModel} model 组件模型
   */
  _addWidgetData(model: any) {
    // widget拿到的是matchdata
    const matchData = model.getMatchNode();
    this.data = MatchData._createRenderData(
      this.id,
      null,
      this.modelName,
      this.type,
      null,
      model,
    );
    // 从matchData获取构建其它数据
    this._createFromWidget(matchData);
  }

  /**
   * 增加可变节点元素模型数据
   * @param {ElementXModel} model
   */
  _addElementXData(model: any) {
    // 可变节点元素模型拿到的是一系列基础ElementModel
    const ems = model._matchDatas;
    this.data = MatchData._createRenderData(
      this.id,
      null,
      this.modelName,
      this.type,
      null,
      model,
    );
    //
    this._createFromElementX(ems);
  }

  /**
   * 增加自定义组件模型数据
   * @param {SymbolData} symbolData 自定义组件模型数据
   */
  _addSymbolData(symbolData: any) {
    this.data = symbolData;
  }

  /**
   * 获取匹配了的节点数组
   */
  getMatchNode() {
    return this._matchNodes;
  }

  /**
   * 获取MatchData生成的RenderData
   * @returns {RenderData}
   */
  getRenderData() {
    return this.data;
  }
}

/**
 * DSL模块数据储存结构类
 * 渲染信息的记录及返回
 */
class RenderData {
  _parentId: string;

  _id: string;

  _type: string;

  _modelName: string;

  _modelRef: any;

  _abX: number;

  _abY: number;

  _abXops: number;

  _abYops: number;

  _width: number;

  _height: number;

  _canLeftFlex: any;

  _canRightFlex: any;

  _isCalculate: boolean;

  _constraints: {};

  _zIndex: number;

  _text: any;

  _path: any;

  _styles: {};

  _similarId: any;

  _similarParentId: any;

  _modelId: any;

  children: any[];

  nodes: any;

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
    this._canLeftFlex = null;
    this._canRightFlex = null;
    this._isCalculate = false;
    this._constraints = {};
    this._zIndex = 0;
    this._text = null;
    this._path = null;
    this._styles = {};
    this._similarId = null;
    this._similarParentId = null;
    this._modelId = null;

    this.children = []; // 子节点储存
    this.nodes = null; // 模型里面对应的节点储存, 也是RenderData形式, key-value形式, 对应模板ref
  }

  /**
   * Json格式输出
   */
  toJSON() {
    return {
      parentId: this._parentId,
      id: this._id,
      type: this._type,
      modelName: this._modelName,
      modelRef: this._modelRef,
      abX: this._abX,
      abY: this._abY,
      abXops: this._abXops,
      abYops: this._abYops,
      width: this._width,
      height: this._height,
      canLeftFlex: this._canLeftFlex,
      canRightFlex: this._canRightFlex,
      isCalculate: this._isCalculate,
      zIndex: this._zIndex,
      text: this._text,
      path: this._path,
      styles: this._styles,
      similarId: this._similarId,
      similarParentId: this._similarParentId,
      modelId: this._modelId,
      constraints: Object.assign({}, this._constraints),
      children: this.children.map(child => child.toJSON()),
      nodes: this._jsonNodes(),
    };
  }

  _jsonNodes() {
    if (!this.nodes || this.nodes === {}) {
      return null;
    }

    const res: any = {};
    const { nodes } = this;
    Object.keys(nodes).forEach((key: string) => {
      const nd = nodes[key];
      res[key] = nd.toJSON();
    });
    return res;
  }

  /**
   * 根据下一层所有子节点abX, abY, abXops, abYops, width, height 生成最小范围属性
   * @param {Boolean} isResizeByNodes 是否从.nodes中计算, 否则从.children中计算
   */
  resize(isResizeByNodes: any) {
    let children: any = [];
    const { nodes } = this;
    if (isResizeByNodes) {
      Object.keys(nodes).forEach((key: string) => {
        children.push(nodes[key]);
      });
    } else {
      ({ children } = this);
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (i === 0) {
        this._abX = children[0].abX;
        this._abY = children[0].abY;
        this._abXops = children[0].abXops;
        this._abYops = children[0].abYops;
        this._width = children[0].width;
        this._height = children[0].height;
      } else {
        this._abX = child.abX < this._abX ? child.abX : this._abX;
        this._abY = child.abY < this._abY ? child.abY : this._abY;
        this._abXops =
          child.abXops > this._abXops ? child.abXops : this._abXops;
        this._abYops =
          child.abYops > this._abYops ? child.abYops : this._abYops;
      }
    }

    this._width = Math.abs(this._abXops - this._abX);
    this._height = Math.abs(this._abYops - this._abY);
  }

  set(prop: any, value: any) {
    if (prop === 'children') {
      this.children = value;
      this._zIndex =
        this._zIndex ||
        Math.max(...this.children.map((child: any) => child._zIndex));
      return;
    }
    const that: any = this;
    that[`_${prop}`] = value;
  }

  // resetZIndex() {
  // this._zIndex = this.children.length ? Math.min(...this.children.map(nd => nd.zIndex)) : null;
  // }

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

  get styles() {
    return this._styles;
  }

  get similarId() {
    return this._similarId;
  }

  get similarParentId() {
    return this._similarParentId;
  }

  get modelId() {
    return this._modelId;
  }
}

/**
 * Symbol数据的数据结构
 */
class SymbolData {
  _id: any;

  _md5: any;

  _template: any;

  _style: any;

  _type: any;

  _modelName: string;

  _abX: number;

  _abY: number;

  _abXops: number;

  _abYops: number;

  _width: number;

  _height: number;

  _zIndex: number;

  nodes: any[];

  /**
   * 数据字段
   * @param {String} id
   * @param {String} md5Value symbol的md5值
   * @param {String} tplStr symbol模板
   * @param {String} styleStr symbol样式
   */
  constructor(id: any, md5Value: any, tplStr: any, styleStr: any) {
    this._id = id || null;
    this._md5 = md5Value || null;
    this._template = tplStr || null;
    this._style = styleStr || null;

    // this._type = Common.QSymbol;
    this._modelName = '';
    this._abX = 0;
    this._abY = 0;
    this._abXops = 0;
    this._abYops = 0;
    this._width = 0;
    this._height = 0;
    this._zIndex = 0;

    this.nodes = []; // symbol里面储存的节点
  }

  set(prop: any, value: any) {
    const that: any = this;
    that[`_${prop}`] = value;
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

  get zIndex() {
    return this._zIndex;
  }

  get md5() {
    return this._md5;
  }

  get template() {
    return this._template;
  }

  get style() {
    return this._style;
  }
}

// 默认要忽略的属性
const defaultIgnoreList = ['width', 'height'];
/**
 * 对传进来的json进行md5求值, 并根据ignoreList进行将某些属性设置为null
 * @param {Json} jsonData 要md5的json数据
 * @param {Array} ignoreList 要忽略的属性
 */
const jsonToMD5 = function(jsonData: any, ignoreList: any) {
  if (!jsonData) {
    return null;
  }

  const strData = JSON.stringify(jsonData);
  const md5 = crypto.createHash('md5');
  const val = md5.update(strData).digest('hex');

  return val;
};

// 对外接口
export default {
  BaseModel,
  ElementModel,
  ElementXModel,
  WidgetModel,
  SymbolModel,
  LayoutModel,
  MatchData,
  RenderData,
  SymbolData,
  jsonToMD5,
};
