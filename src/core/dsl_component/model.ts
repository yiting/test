// 模型只处理节点的匹配逻辑, 不作数据的重组等处理
import Common from './common';

/**
 *
 */
class BaseModel {
  _name: string;
  _textNum: number;
  _imageNum: number;
  _priority: number;
  _modelType: string;

  _nodes: any[];
  _nodesTexts: any[];
  _nodesImages: any[];
  _matchNodes: {}; // 匹配用节点记录

  constructor(
    name: string,
    textNum: number,
    imageNum: number,
    priority: number,
    modelType: string,
  ) {
    this.name = name || '';
    this.textNum = textNum || 0;
    this.imageNum = imageNum || 0;
    this.priority = priority || Common.LvD;
    this.modelType = modelType || '';
  }

  public get name() {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get textNum() {
    return this._textNum;
  }

  public set textNum(num: number) {
    this._textNum = num;
  }

  public get imageNum() {
    return this._imageNum;
  }

  public set imageNum(num: number) {
    this._imageNum = num;
  }

  public get priority() {
    return this._priority;
  }

  public set priority(priority: number) {
    this._priority = priority;
  }

  public get modelType() {
    return this._modelType;
  }

  public set modelType(type: string) {
    this._modelType = type;
  }

  public set matchNodes(nodeObject: any) {
    this._matchNodes = nodeObject;
  }

  public get matchNodes() {
    return this._matchNodes;
  }

  public getNumber() {
    return this._textNum + this._imageNum;
  }

  public get nodes() {
    return this._nodes;
  }

  public get nodesTexts() {
    return this._nodesTexts;
  }

  public get nodesImages() {
    return this._nodesImages;
  }

  // 子类实现
  _initNode(): void {
    const self: any = this;
    return null;
  }

  // 子类实现
  _whenMatched(): void {
    const self: any = this;
    return null;
  }

  // 初始化匹配节点
  _initMatchNode(nodes: any) {
    this._nodes = nodes || [];
    this._nodesTexts = [];
    this._nodesImages = [];
    this._matchNodes = {};

    nodes.forEach((nd: any) => {
      switch (nd.type) {
        case Common.QText:
          this._nodesTexts.push(nd);
          break;
        case Common.QImage:
          this._nodesImages.push(nd);
          break;
      }
    });
  }

  // 设置匹配了的标识
  _setMatchedNodeSign() {
    this._nodes.forEach((nd: any) => {
      nd['isMatched'] = true;
    });
  }

  // 节点是否与模型匹配
  isMatch(nodes: any): boolean {
    // 初始化参数
    this._initMatchNode(nodes);
    // 执行子类的initNode
    this._initNode();

    let result = false;
    const self: any = this;
    // 匹配的方式是通过自定义多个规则的regular函数来得出是否匹配
    // 这里先hardcode定义20个规则,而且是&&的关系
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

      if (result === true) {
        // 匹配了给一个标记
        // 子模型执行
        this._whenMatched();
      }
    }
    return result;
  }

  // 重置传进来的匹配节点的匹配标识
  resetMatchedNodeSign() {
    this._nodes.forEach((nd: any) => {
      nd['isMatched'] = false;
    });
  }
}

export default BaseModel;
