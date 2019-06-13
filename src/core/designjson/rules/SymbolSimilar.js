const Rule = require('./Rule');
const Utils = require('./Util');
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
let weight = 1;
/**
 * 是否在同个symbol的规则
 * 若节点都在同一个symbol里，则得分高
 */
class SymbolSimilar extends Rule {
  constructor(param) {
    super(param);
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  getRuleType() {
    return this.constructor.name;
  }
  getNodeType(node) {
    var type;
    if (typeof node.symbolRoot != 'undefined') {
      type = 'symbol';
    } else {
      type = 'normal';
    }
    return type;
  }
  isSymbolInstance(node) {
    var result = false;
    if (node._origin && node._origin._class == 'symbolInstance') {
      result = true;
    }
    return result;
  }
  getValue(nodeA, nodeB) {
    if (
      nodeA.name.indexOf('红包本宝') > -1 &&
      nodeB.name.indexOf('Rectangle 11') > -1
    ) {
      // console.log(1);
    }
    let nodeAType = this.getNodeType(nodeA);
    let nodeBType = this.getNodeType(nodeB);
    let value = 0;
    if (nodeAType == 'symbol' && nodeBType == 'symbol') {
      let nodeASymbolRoot = nodeA.symbolRoot;
      let nodeBSymbolRoot = nodeB.symbolRoot;
      if (
        nodeASymbolRoot[0] == nodeBSymbolRoot[0] &&
        !this.isSymbolInstance(nodeA) &&
        !this.isSymbolInstance(nodeB)
      ) {
        value = 1;
      } else {
        value = 0;
      }
    } else {
      value = 0;
    }
    // console.log(this.getRuleType()+" value:"+value);
    return value;
  }
  getPureScore(nodeA, nodeB) {
    if (typeof this.pureScore == 'undefined') {
      var value = this.getValue(nodeA, nodeB);
      this.pureScore =
        ((Math.pow(value + 1, 5) - Math.pow(1, 5)) /
          (Math.pow(2, 5) - Math.pow(1, 5))) *
        100;
    }
    return this.pureScore;
  }
}
module.exports = SymbolSimilar;
