const Rule = require('./Rule');
const Util = require('./Util');
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
let weight = 1;
/**
 * AI认为是否该合并的规则
 * 若节点都在AI认为该合成的同一个区域内，则得分高
 */
class AiSimilar extends Rule {
  constructor(param) {
    super(param);
    this.score = undefined;
    this.value = undefined;
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
    this.weight = param && param.weight ? param.weight : weight;
  }
  getRuleType() {
    return this.constructor.name;
  }
  getIntersectType(nodeA, nodeB) {
    let nodeAabX = nodeA.abX;
    let nodeBabX = nodeB.abX;
    let percentSize;
    let result = false;
    let type = -1; // 0 包含 ， 1 相交 ，2相离
    let nodeAi = nodeB;
    //保证A在左，B在右
    if (nodeAabX > nodeBabX) {
      var tmpNode = nodeB;
      nodeB = nodeA;
      nodeA = tmpNode;
      nodeAabX = nodeA.abX;
      nodeBabX = nodeB.abX;
      nodeAi = nodeA;
    }
    let nodeAabXOps = Util.getAbXOps(nodeA);
    let nodeBabXOps = Util.getAbXOps(nodeB);
    let nodeAabYOps = Util.getAbYOps(nodeA);
    let nodeBabYOps = Util.getAbYOps(nodeB);
    let nodeASize = Util.getSize(nodeA);
    let nodeBSize = Util.getSize(nodeB);
    let nodeAabY = nodeA.abY;
    let nodeBabY = nodeB.abY;
    let smallSize = nodeASize > nodeBSize ? nodeBSize : nodeASize;

    if (smallSize == Util.getSize(nodeAi)) {
      //节点大小比ai识别范围大，则不符合节点在ai识别范围内
    } else {
      if (
        nodeA.abX <= nodeB.abX &&
        nodeAabXOps >= nodeBabXOps &&
        nodeA.abY <= nodeB.abY &&
        nodeAabYOps >= nodeBabYOps
      ) {
        //A包含B的情况
        type = 0;
      } else if (
        nodeAabXOps < nodeBabX ||
        (nodeAabYOps < nodeBabY && nodeAabY < nodeBabY) ||
        (nodeBabYOps < nodeAabY && nodeBabY < nodeAabY)
      ) {
        //AB相离的情况
        type = 1;
      } else {
        //AB相交的情况
        let intersectWidth = Math.abs(nodeAabXOps - nodeBabX);
        let intersectHeight;
        let intersectSize;
        if (nodeAabYOps > nodeBabY && nodeBabYOps > nodeAabYOps) {
          //A左上B右下
          intersectHeight = nodeAabYOps - nodeBabY;
        } else if (nodeAabY < nodeBabYOps && nodeAabYOps > nodeBabYOps) {
          //A左下B右上
          intersectHeight = nodeBabYOps - nodeAabY;
        } else if (nodeAabY < nodeBabY && nodeAabYOps > nodeBabYOps) {
          //A高度包含B
          intersectHeight = nodeB.height;
        } else {
          //B高度包含A
          intersectHeight = nodeA.height;
        }
        intersectSize = intersectWidth * intersectHeight;
        percentSize = intersectSize / smallSize;
        type = 2;
      }
      if (type == 0 || (type == 2 && percentSize > 0.8)) {
        result = true;
      }
    }

    return result;
  }
  getValue(nodeA, nodeB, sliceArr) {
    let nodeASliceIndex = -1;
    let nodeBSliceIndex = -1;
    let value = 0;
    if (typeof sliceArr == 'undefined') {
      return value;
    }
    if (
      nodeA.name.indexOf('Rectangle12') > -1 &&
      nodeB.name.indexOf('Oval1') > -1
    ) {
      // debugger;
    }
    for (var i = 0, ilen = sliceArr.length; i < ilen; i++) {
      nodeASliceIndex = -1;
      nodeBSliceIndex = -1;
      if (this.getIntersectType(nodeA, sliceArr[i])) {
        nodeASliceIndex = i;
      }
      if (this.getIntersectType(nodeB, sliceArr[i])) {
        nodeBSliceIndex = i;
      }
      if (nodeASliceIndex != -1 && nodeBSliceIndex != -1) {
        break;
      }
    }
    // 比较两个节点是否在同一个slice里
    if (
      nodeASliceIndex == nodeBSliceIndex &&
      nodeASliceIndex != -1 &&
      nodeBSliceIndex != -1
    ) {
      value = 1 * sliceArr[i]['rate'];
    } else {
      value = 0;
    }
    // console.log(this.getRuleType()+" value:"+value);
    return value;
  }
  getScore(nodeA, nodeB, sliceArr) {
    if (typeof this.pureScore == 'undefined') {
      this.pureScore = this.getPureScore(nodeA, nodeB, sliceArr);
    }
    this.score = this.pureScore * this.weight;
    return this.score;
  }
  getPureScore(nodeA, nodeB, sliceArr) {
    if (typeof this.pureScore == 'undefined') {
      var value = this.getValue(nodeA, nodeB, sliceArr);
      this.pureScore =
        ((Math.pow(value + 1, 5) - Math.pow(1, 5)) /
          (Math.pow(2, 5) - Math.pow(1, 5))) *
        100;
    }
    return this.pureScore;
  }
}
module.exports = AiSimilar;
