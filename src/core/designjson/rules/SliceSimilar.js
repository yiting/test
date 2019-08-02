const Rule = require('./Rule');
const Util = require('./Util');
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
let weight = 1;
/**
 * 是否在同个slice的规则
 * 若节点都在同一个slice的区域内，则得分高
 */
class SliceSimilar extends Rule {
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
    //保证A在左，B在右
    if (nodeAabX > nodeBabX) {
      nodeB = t_nodeA;
      nodeA = t_nodeB;
      nodeAabX = nodeA.abX;
      nodeBabX = nodeB.abX;
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
      let intersectWidth;
      if (nodeAabXOpsOri >= nodeBabXOpsOri) {
        intersectWidth = Math.abs(nodeBabXOpsOri - nodeBabX);
      } else {
        intersectWidth = Math.abs(nodeAabXOpsOri - nodeBabX);
      }
      let intersectHeight;
      let intersectSize;
      if (nodeAabYOpsOri >= nodeBabY && nodeBabYOpsOri >= nodeAabYOpsOri) {
        //A左上B右下（真实坐标）
        intersectHeight = nodeAabYOpsOri - nodeBabY;
      }
      if (nodeAabYOps >= nodeBabY && nodeBabYOps >= nodeAabYOps) {
        //A左上B右下（加阀值坐标）
        intersectHeight = nodeAabYOps - nodeBabY;
      } else if (
        nodeAabY <= nodeBabYOpsOri &&
        nodeAabYOpsOri >= nodeBabYOpsOri
      ) {
        //A左下B右上（真实坐标）
        intersectHeight = nodeBabYOpsOri - nodeAabY;
      } else if (nodeAabY <= nodeBabYOps && nodeAabYOps >= nodeBabYOps) {
        //A左下B右上（加阀值坐标）
        intersectHeight = nodeBabYOps - nodeAabY;
      } else if (nodeAabY <= nodeBabY && nodeAabYOpsOri >= nodeBabYOpsOri) {
        //A高度包含B（真实坐标）
        intersectHeight = nodeB.height;
      } else if (nodeAabY <= nodeBabY && nodeAabYOps >= nodeBabYOps) {
        //A高度包含B（加阀值坐标）
        intersectHeight = nodeB.height;
      } else {
        //B高度包含A
        intersectHeight = nodeA.height;
      }
      intersectSize = intersectWidth * intersectHeight;
      percentSize = intersectSize / smallSize;
      if (percentSize > 1) {
        percentSize = 1;
      }
      type = 2;
    }
    if (type == 0 || (type == 2 && percentSize > 0.8)) {
      //如果slice包含，则再看levelArr是否在同一目录下
      var isSameLevelArr = true;
      var levelArrA = this.getNodeLevel(t_nodeA);
      var levelArrB = this.getNodeLevel(t_nodeB);
      for (var i = 0, ilen = levelArrA.length; i < ilen - 1; i++) {
        if (levelArrA[i] != levelArrB[i]) {
          isSameLevelArr = false;
          break;
        }
      }

      if (isSameLevelArr) {
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
      nodeA.name.indexOf('Rectangle 16') > -1 &&
      nodeB.name.indexOf('Rectangle 17') > -1
    ) {
      // debugger;
    }
    nodeASliceIndex = -1;
    nodeBSliceIndex = -1;
    for (var i = 0, ilen = sliceArr.length; i < ilen; i++) {
      if (this.getIntersectType(sliceArr[i], nodeA)) {
        nodeASliceIndex = i;
      }
      if (this.getIntersectType(sliceArr[i], nodeB)) {
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
      value = 1;
    } else {
      //如果一个在slice里，一个不在slice里，或者在不同的slice里，则铁定不合并，以0做区分
      if (nodeASliceIndex != -1 || nodeBSliceIndex != -1) {
        value = 0;
      } else {
        //两个都不在slice里，还要做后续都判断
        value = 0.01;
      }
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
module.exports = SliceSimilar;
