const Rule = require('./Rule');
const Util = require('./Util');
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
let weight = 1;
/**
 * 是否在同个slice的规则
 * 若节点都在同一个slice的区域内，则得分高
 */
class AiSimilar extends Rule {
  constructor(param) {
    super(param);
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  getRuleType() {
    return this.constructor.name;
  }
  getNodeLevel(node) {
    var levelArr = [];
    if (typeof node.levelArr != 'undefined') {
      levelArr = node.levelArr;
    } else {
      for (var i = 0, ilen = node._imageChildren.length; i < ilen; i++) {
        if (typeof node._imageChildren[i].levelArr != 'undefined') {
          levelArr = node._imageChildren[i].levelArr;
          break;
        } else {
          levelArr = this.getNodeLevel(node._imageChildren[i]);
        }
      }
    }
    return levelArr;
  }
  getIntersectType(t_nodeA, t_nodeB) {
    let nodeA = t_nodeA,
      nodeB = t_nodeB;
    let nodeAabX = nodeA.abX;
    let nodeBabX = nodeB.abX;
    let percentSize;
    let result = false;
    let type = -1; // 0 包含 ， 1 相交 ，2相离
    let hasChange = false;
    //保证A在左，B在右
    if (nodeAabX > nodeBabX) {
      nodeB = t_nodeA;
      nodeA = t_nodeB;
      nodeAabX = nodeA.abX;
      nodeBabX = nodeB.abX;
      hasChange = true;
    }
    let nodeAabXOpsOri = Util.getAbXOps(nodeA);
    let nodeAabXOps = Util.getAbXOps(nodeA);
    let nodeBabXOpsOri = Util.getAbXOps(nodeB);
    let nodeBabXOps = Util.getAbXOps(nodeB);
    let nodeAabYOpsOri = Util.getAbYOps(nodeA);
    let nodeAabYOps = Util.getAbYOps(nodeA);
    let nodeBabYOpsOri = Util.getAbYOps(nodeB);
    let nodeBabYOps = Util.getAbYOps(nodeB);
    let nodeASize = Util.getSize(nodeA);
    let nodeBSize = Util.getSize(nodeB);
    let nodeAabY = nodeA.abY;
    let nodeBabY = nodeB.abY;
    let smallSize = nodeASize > nodeBSize ? nodeBSize : nodeASize;

    if (
      nodeAabX <= nodeBabX &&
      nodeAabXOps >= nodeBabXOps &&
      nodeAabY <= nodeBabY &&
      nodeAabYOps >= nodeBabYOps
    ) {
      //A包含B的情况
      if (!hasChange) {
        type = 0;
      }
    } else if (
      nodeAabXOps < nodeBabX ||
      (nodeAabYOps < nodeBabY && nodeAabY < nodeBabY) ||
      (nodeBabYOps < nodeAabY && nodeBabY < nodeAabY)
    ) {
      //AB相离的情况
      type = 1;
    } else {
      //AB相交的情况
    }
    if (type == 0) {
      result = true;
    }
    return result;
  }
  getValue(nodeA, nodeB, aiArr) {
    let nodeASliceIndex = -1;
    let nodeBSliceIndex = -1;
    let value = 0;
    if (typeof aiArr == 'undefined') {
      return value;
    }
    nodeASliceIndex = -1;
    nodeBSliceIndex = -1;

    let nodeAAiSize = 10000000000000;
    let nodeBAiSize = 10000000000000;

    for (var i = 0, ilen = aiArr.length; i < ilen; i++) {
      if (this.getIntersectType(aiArr[i], nodeA)) {
        let aiSize = Util.getSize(aiArr[i]);
        if (aiSize < nodeAAiSize) {
          nodeAAiSize = aiSize;
          nodeASliceIndex = i;
        }
      }
      if (this.getIntersectType(aiArr[i], nodeB)) {
        let aiSize = Util.getSize(aiArr[i]);
        if (aiSize < nodeBAiSize) {
          nodeBAiSize = aiSize;
          nodeBSliceIndex = i;
        }
      }
    }
    if (
      nodeASliceIndex == nodeBSliceIndex &&
      nodeASliceIndex != -1 &&
      nodeBSliceIndex != -1
    ) {
      value = 1 * aiArr[nodeBSliceIndex]['rate'];
    } else {
      value = 0;
    }
    return value;
  }
  getScore(nodeA, nodeB, aiArr) {
    if (typeof this.pureScore == 'undefined') {
      this.pureScore = this.getPureScore(nodeA, nodeB, aiArr);
    }
    this.score = this.pureScore * this.weight;
    return this.score;
  }
  getPureScore(nodeA, nodeB, aiArr) {
    if (typeof this.pureScore == 'undefined') {
      var value = this.getValue(nodeA, nodeB, aiArr);
      this.pureScore =
        ((Math.pow(value + 1, 5) - Math.pow(1, 5)) /
          (Math.pow(2, 5) - Math.pow(1, 5))) *
        100;
    }
    return this.pureScore;
  }
}
module.exports = AiSimilar;
