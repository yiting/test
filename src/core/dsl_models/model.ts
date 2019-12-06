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
    return this._priority
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

  // 这里根据栅格化的特点,用于匹配的节点是layer里面层的节点
  //
  _initMatchNode(node: any): boolean {
    // 找出当前node下可用于匹配的节点, 如果能找到合适的则进行匹配
    // 否则直接跳出不进行匹配
    // 用于匹配的节点是 Image, Text, Inline
    if (!node || node.children.length <= 0) {
      return false;
    }
    let mNodes: any = [];
    this._findMatchNode(node, mNodes);

    // if (this._nodes.length >= 1) {
    //   return true;
    // }
    return false;
  }

  _findMatchNode(parentNode: any, matchNodes: any[]) {
    // 找到第一个可以匹配的元素的那个layer后的所有子节点则不继续往下寻找
    if (!parentNode || parentNode.children.length == 0) return;

    parentNode.children.forEach((child: any) => {
      if (child.type == 'QText' || child.type == 'QImage') {
        matchNodes.push(child);
      }
      // else if (parentNode.length == 1 && child.type == 'QLayer') {
      //   // 只包含自己而且是QLayer才继续往下找
      //   this._findMatchNode(child, matchNodes);
      // }
    });
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

  isMatch(node: any): boolean {
    // 把传进的节点做个简单处理
    let goMatch =  this._initMatchNode(node);
    if (!goMatch) {
      return false;
    }
    console.log(this._nodes);

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
      }
      else {
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
}

export default BaseModel;

