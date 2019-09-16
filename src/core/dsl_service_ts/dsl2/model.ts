// 此模块定义了元素模型及组件模型的构造类
// 并提供dsl模块model使用的对外接口
import Common from './common';
import { debug } from 'util';

/**
 * 元素模型组件模型基类
 */
class BaseModel {
  // 基础属性
  _textNum: number; // 构成模型的文字节点数
  _imageNum: number; // 构成模型的图片节点数
  _elementNum: number; // 构成模型的总节点数

  // 用于节点匹配时的记录
  _nodes: any[]; // 需要进行匹配的元素
  _nodeTexts: any[]; // 匹配的元素中文字元素
  _nodeImages: any[]; // 匹配的元素中图片元素
  _matchNodes: any; // 用于记录模板中对应的节点, 通过key-value形式返回匹配的节点数据

  // 匹配后属性记录
  id: any; // 模型唯一id
  type: string; // 模型的类型
  modelName: string; // 模型的名称
  x: number; // 设计稿的x坐标, 这里暂不需要用到
  y: number; // 设计稿的y坐标, 这里暂不需要用到
  abX: number; // 基于原点的x坐标
  abY: number; // 基于原点的y坐标
  width: number; // 宽度
  height: number; // 高度
  abXops: number; // 对角坐标x
  abYops: number; // 对角坐标y
  zIndex: number; // 显示层级
  priority: number; // 匹配优先级

  // 模型空间辅助计算
  canLeftFlex: any; // 是否可以左扩展
  canRightFlex: any; // 是否可以右扩展

  /**
   * @param {String} name 组件模型的名称
   * @param {Int} textNum 组成模型的文本节点的数量
   * @param {Int} imageNum 组成模型的图片节点的数量
   * @param {Int} priority 模型的优先级
   * @param {String} modelType 模型的类别
   */
  constructor(
    name: string,
    textNum: number,
    imageNum: number,
    priority: number,
    modelType: string,
  ) {
    // 元素模型的基础属性
    this._textNum = textNum || 0;
    this._imageNum = imageNum || 0;
    this._elementNum = this._textNum + this._imageNum;

    // 当传进节点进行匹配时节点属性的记录
    this._nodes = [];
    this._nodeTexts = [];
    this._nodeImages = [];
    this._matchNodes = {};

    // 元素模型的基础属性
    // 属性通过传进的节点计算而来, 用于组件模型匹配时的再计算
    this.id = null;
    this.type = modelType || null;
    this.modelName = name;
    this.x = 0;
    this.y = 0;
    this.abX = 0;
    this.abY = 0;
    this.width = 0;
    this.height = 0;
    this.abXops = 0;
    this.abYops = 0;
    this.zIndex = 0;
    this.priority = priority || Common.LvD; // 优先级越大就越先进行匹配

    // 模型空间是否可左右扩展, 默认不赋值
    this.canLeftFlex = null;
    this.canRightFlex = null;
  }

  /**
   * 将传进来匹配的节点做分类处理并生成各计算参数
   * @param {Array} nodes 需要匹配的节点
   */
  _initMatchNode(nodes: any[]): void {
    this._nodes = nodes || [];
    this._nodeTexts = [];
    this._nodeImages = [];
    this._matchNodes = {};

    nodes.forEach(nd => {
      switch (nd.type) {
        case Common.QText:
          this._nodeTexts.push(nd);
          break;
        case Common.QImage:
          this._nodeImages.push(nd);
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
  _initMatchParam(nodes: any[]): void {
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
    const self: any = this;
    return null;
  }

  /**
   * 子类实现
   * 当节点能与模型匹配时的处理
   */
  _whenMatched(): void {
    const self: any = this;
    return null;
  }

  /**
   * 给已匹配的元素做一个标识,防止重复匹配
   */
  _setMatchedNodeSign(): void {
    this._nodes.forEach((nd: any) => {
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

    let result: boolean = false;
    const self: any = this;
    // 匹配的方式是通过自定义多个规则的regular函数来得出是否匹配
    // 这里先hardcode定义最多20个规则，而且这20个规则是 && 的关系
    // 以后再考虑是否拓展支持 || 关系
    for (let i = 1; i <= 20; i++) {
      if (self[`regular${i}`]) {
        result = self[`regular${i}`].apply(this);
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
      // 子类执行
      this._whenMatched();
    }
    return result;
  }

  /**
   * 重置传进来的匹配节点的匹配标识
   */
  resetMatchedNodeSign(): void {
    this._nodes.forEach((nd: any) => {
      nd.isMatched = false;
    });
  }

  /**
   * 获取这个组件的元素数量
   * @returns {Int} 返回该组件模型的元素个数
   */
  getNumber(): number {
    return this._elementNum;
  }

  /**
   * 获取这个组件的文本元素数量
   * @returns {Int}
   */
  getTextNumber(): number {
    return this._textNum;
  }

  /**
   * 获取这个组件的图片元素数量
   * @returns {Int}
   */
  getImageNumber(): number {
    return this._imageNum;
  }

  /**
   * 获取传进来要匹配的元素
   * @returns {Array}}
   */
  getNodes(): any[] {
    return this._nodes;
  }

  /**
   * 从匹配的节点中刷选出QText元素
   * @returns {Array}
   */
  getTextNodes(): any[] {
    return this._nodeTexts;
  }
  /**
   * 从匹配的节点中刷选出QImage元素
   * @returns {Array}
   */
  getImageNodes(): any[] {
    return this._nodeImages;
  }

  /**
   * 返回匹配到的根据模板键值储存的信息
   */
  getMatchNode(): any {
    return this._matchNodes;
  }

  /**
   * 返回通过模型生成的MatchData
   * @return {MatchData}
   */
  getMatchData() {
    return new MatchData(this, null);
  }
}

/**
 * 元素模型
 */
class ElementModel extends BaseModel {
  /**
   * 元素模型匹配成功
   */
  _whenMatched(): void {
    // 元素模型匹配的是designjson的数据, 所以this._nodes的数据格式是designjson
    this._nodes.forEach((nd: any) => {
      // design的node节点没有abXops, abYops, canLeftFlex, canRightFlex属性, 顺带赋值
      nd.abXops = nd.abX + nd.width;
      nd.abYops = nd.abY + nd.height;

      switch (nd.type) {
        case Common.QText:
          nd.modelName = 'em1-m1';
          // nd.canLeftFlex = false;
          // nd.canRightFlex = true;
          break;
        case Common.QImage:
          nd.modelName = 'em1-m2';
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
 * 该模型用于匹配一行节点
 */
class ElementXModel extends BaseModel {
  _matchDatas: any[]; // 储存匹配了的MatchData数据组

  /**
   * @param {String} name 组件模型的名称
   * @param {Int} textNum 组成模型的文本节点的数量
   * @param {Int} imageNum 组成模型的图片节点的数量
   * @param {Int} priority 模型的优先级
   * @param {String} modelType 模型的类别
   */
  constructor(
    name: string,
    textNum: number,
    imageNum: number,
    priority: number,
    modelType: string,
  ) {
    // 定义一个元素模型的基础属性
    super(name, textNum, imageNum, priority, modelType);

    this._matchDatas = []; // 可变节点模型用于储存匹配了的MatchData数据
  }

  /**
   * 改写getMatchData,一般模型返回一个MatchData,
   * 可变节点模型因为不是按节点数量组合, 所以一个范围内可能有多个组合,所以这里返回的是一个
   * 可变节点模型的列表
   */
  getMatchData(): any {
    let result: any[] = [];
    this._matchDatas.forEach((mDatas: any) => {
      // 直接传入MatchData列表去构建
      result.push(new MatchData(this, mDatas));
    });

    return result;
  }
}

/**
 * 组件模型
 * 由于现时模型逻辑都在BaseModel里实现了,这里先预留
 */
class WidgetModel extends BaseModel {}

/**
 * 用于元素模型及组件模型匹配的数据结构化储存类
 */
class MatchData {
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
  ): any {
    const renderData = new RenderData();
    renderData.set('id', id);

    // renderData.set('parentId', parentId);
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

  _matchNodes: any[]; // 匹配了的节点
  id: any; // 唯一id
  type: string; // 类型
  modelName: string; // 模型名称
  abX: number;
  abY: number;
  abXops: number;
  abYops: number;
  width: number;
  height: number;

  canLeftFlex: any;
  canRightFlex: any;
  zIndex: number;
  similarParentId: any;
  similarId: any;
  data: any;

  /**
   * 获取匹配模型的数据进行储存
   * @param {Object} model 匹配的元素或组件模型或自定义组件模型(ElementModel, WidgetModel, SymbolData)
   * @param {Array} datas 传入一组MatchData则自动构建一个
   */
  constructor(model: any, datas: any[]) {
    if (model instanceof ElementModel || model instanceof WidgetModel) {
      // 普通元素模型及组件模型直接初始化
      this._init(model);
      // 传进来的是ElementModel或者WidgetModel, 元素模型和组件模型
      this._initWithModel(model);
      // 匹配了的节点数组
      this._matchNodes = model.getNodes();
    } else if (model instanceof ElementXModel) {
      // 可变节点模型的构建依靠传进来的datas
      this._init2(model, datas);
      this._initWithXModel(model, datas);
      this._matchNodes = datas;
    }
  }

  /**
   * 初始化基础数据
   * @param {Object} model
   */
  _init(model: any): void {
    this.id = null;
    this.type = model.type || null;
    this.modelName = model.modelName || 'no-model-name';
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
   * 初始化基础数据并直接带有数组数据
   * @param model
   * @param datas
   */
  _init2(model: any, datas: any[]) {
    this.id = null;
    this.type = model.type || null;
    this.modelName = model.modelName || 'no-model-name';

    // 计算abX, abY等数值
    // 根据匹配出的基础模型计算出模型的各参数
    for (let i = 0; i < datas.length; i++) {
      let node = datas[i];

      if (i === 0) {
        this.abX = node.abX;
        this.abY = node.abY;
        this.abXops = node.abXops;
        this.abYops = node.abYops;
        this.zIndex = node.zIndex; // 层级的设定
        continue;
      }

      // 比较大小得出这个组件的大小
      this.abX = this.abX < node.abX ? this.abX : node.abX;
      this.abY = this.abY < node.abY ? this.abY : node.abY;
      this.abXops = this.abXops < node.abXops ? node.abXops : this.abXops;
      this.abYops = this.abYops < node.abYops ? node.abYops : this.abYops;

      // zIndex取最低那个
      this.zIndex = this.zIndex > node.zIndex ? node.zIndex : this.zIndex;
    }

    this.width = Math.abs(this.abXops - this.abX);
    this.height = Math.abs(this.abYops - this.abY);
    this.canLeftFlex = model.canLeftFlex;
    this.canRightFlex = model.canRightFlex;
    // this.zIndex = model.zIndex || 0;
    // 相似性标识
    this.similarParentId = null;
    this.similarId = null;
    this.data = null; // RenderData
  }

  /**
   * 根据Model构建MatchData
   * @param {BaseModel} model 匹配的元素或组件模型
   */
  _initWithModel(model: any): void {
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
   * 根据可变节点元素模型构建出MatchData
   * @param {ElementXModel} model
   * @param {Array} datas 一组MatchData元素
   */
  _initWithXModel(model: any, datas: any[]): void {
    // 临时处理
    // 默认暂时这里只使用第一个节点的id和标识, -ex是一个特别标识, 因为对id每特别需要
    this.id = `${datas[0].id}-ex` || null;
    // 生成this.data数据
    this._addElementXData(model, datas);
  }

  /**
   * 增加元素模型数据
   * @param {BaseModel} model 元素模型
   */
  _addElementData(model: any): void {
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
  _addWidgetData(model: any): void {
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
   * @param {Array} 一组MatchData
   */
  _addElementXData(model: any, datas: any[]): void {
    // 可变节点元素模型拿到的是一系列基础ElementModel
    // 创建一个总MatchData来包装datas
    this.data = MatchData._createRenderData(
      this.id,
      null,
      this.modelName,
      this.type,
      null,
      this,
    );
    this._createFromElementX(datas);
  }

  /**
   * 从designjson获取更多数据
   * @param {RenderData} renderData 要补充属性的RenderData
   * @param {Object} nodeData 从节点匹配后的数据
   */
  _createFromElement(renderData: any, nodeData: any): void {
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
  _createFromWidget(matchData: any): void {
    const renderData: any = this.data;

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
        rData.set('parent', renderData);
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
  _createFromElementX(matchDatas: any): void {
    const renderData: any = this.data;

    // 记录成循环模式
    renderData.nodes = {};
    // renderData.set('type', Common.QLayer);
    for (let i = 0; i < matchDatas.length; i++) {
      const mData = matchDatas[i];
      const rData = mData.getRenderData();
      rData.set('parent', renderData);
      // 这里加入循环标识
      rData.set('modelRef', `${i}`);
      renderData.nodes[`${i}`] = rData;
    }
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

  _parent: any;

  constructor() {
    this._parentId = '';
    this._parent = null;
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
        this._abX = Math.floor(children[0].abX);
        this._abY = Math.floor(children[0].abY);
        this._abXops = Math.ceil(children[0].abXops);
        this._abYops = Math.ceil(children[0].abYops);
      } else {
        this._abX = child.abX < this._abX ? Math.floor(child.abX) : this._abX;
        this._abY = child.abY < this._abY ? Math.floor(child.abY) : this._abY;
        this._abXops =
          child.abXops > this._abXops ? Math.ceil(child.abXops) : this._abXops;
        this._abYops =
          child.abYops > this._abYops ? Math.ceil(child.abYops) : this._abYops;
      }
    }

    this._width = this._abXops - this._abX;
    this._height = this._abYops - this._abY;
  }

  set(prop: any, value: any) {
    if (prop === 'children') {
      this.children = value;
      this._zIndex =
        typeof this._zIndex == 'number'
          ? this._zIndex
          : Math.max(...this.children.map((child: any) => child._zIndex));
      return;
    }
    const that: any = this;
    that[`_${prop}`] = value;
  }

  // resetZIndex() {
  // this._zIndex = this.children.length ? Math.min(...this.children.map(nd => nd.zIndex)) : null;
  // }
  get parent() {
    return this._parent;
  }
  get parentId() {
    return this._parent && this._parent.id;
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

// 对外接口
export default {
  BaseModel,
  ElementModel,
  ElementXModel,
  WidgetModel,
  MatchData,
  RenderData,
};
