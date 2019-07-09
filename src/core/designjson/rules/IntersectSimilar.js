const Rule = require('./Rule');
const Util = require('./Util');
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
let weight = 0.1;
var threshold = 15;
/**
 * 节点相交相似度的规则
 * 计算两节点的相交面积，面积越大得分越高；若两节点相离，则计算最接近的两个端点形成的面积，面积越大得分越低。
 * 优化1：添加阈值，扩大节点范围，使相离较近的节点也认为是相交，能得到较高分数。
 */
class IntersectSimilar extends Rule {
  constructor(param) {
    super(param);
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  getRuleType() {
    return this.constructor.name;
  }
  getValue(nodeA, nodeB) {
    if (
      nodeA.name.indexOf('Rectangle 449 Copy') > -1 &&
      nodeB.name.indexOf('Rectangle 281') > -1
    ) {
      // debugger;
      // console.log(1);
    }
    var nodeAName = '矩形 copy 13';
    var nodeBName = '矩形';
    if (
      (nodeA.name == nodeAName && nodeB.name == nodeBName) ||
      (nodeA.name == nodeBName && nodeB.name == nodeAName)
    ) {
      // console.log(1);
    }
    let nodeAabX = nodeA.abX;
    let nodeBabX = nodeB.abX;
    let result = 0;
    let type = -1; // 0 包含 ， 1 相交 ，2相离
    //保证A在左，B在右
    if (nodeAabX > nodeBabX) {
      var tmpNode = nodeB;
      nodeB = nodeA;
      nodeA = tmpNode;
      nodeAabX = nodeA.abX;
      nodeBabX = nodeB.abX;
    }
    //按旧逻辑，当一个块添加一个阈值后，如果相交则合图
    // nodeA.width = nodeA.width + threshold;
    // nodeA.height = nodeA.height + threshold;
    let nodeAabXOpsOri = Util.getAbXOps(nodeA);
    let nodeAabXOps = Util.getAbXOps(nodeA) + threshold;
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
    //添加的阀值块需要往相交的方向添加
    if (nodeAabYOps <= nodeBabYOps) {
      if (Util.getHeight(nodeA) < 2) {
        nodeAabY = Util.getAbY(nodeA) - threshold / 2;
        nodeAabYOps = Util.getAbYOps(nodeA) + threshold / 2;
      } else {
        nodeAabYOps = Util.getAbYOps(nodeA) + threshold;
      }
    } else {
      if (Util.getHeight(nodeB) < 2) {
        nodeBabY = Util.getAbY(nodeB) - threshold / 2;
        nodeBabYOps = Util.getAbYOps(nodeB) + threshold / 2;
      } else {
        nodeBabYOps = Util.getAbYOps(nodeB) + threshold;
      }
    }

    // let smallSize = 400;

    if (
      nodeA.abX <= nodeB.abX &&
      nodeAabXOpsOri >= nodeBabXOpsOri &&
      nodeA.abY <= nodeB.abY &&
      nodeAabYOpsOri >= nodeBabYOpsOri
    ) {
      //A包含B的情况
      if (nodeASize > 750 * 640 || nodeBSize > 750 * 640) {
        result = 0;
      } else {
        result = 1;
      }
      type = 0;
    } else if (
      nodeAabXOps < nodeBabX ||
      (nodeAabYOps < nodeBabY && nodeAabY < nodeBabY) ||
      (nodeBabYOps < nodeAabY && nodeBabY < nodeAabY)
    ) {
      //AB相离的情况
      let apartWidth = Math.abs(nodeAabXOps - nodeBabX);
      let apartHeight;
      let apartSize;
      if (nodeAabYOps < nodeBabY) {
        //A在上B在下
        apartHeight = nodeBabY - nodeAabYOps;
      } else if (nodeAabY > nodeBabYOps) {
        //A在下B在上
        apartHeight = nodeBabYOps - nodeAabY;
      } else {
        //AB其中一方包含另一方
        apartHeight = nodeA.height > nodeB.height ? nodeB.height : nodeA.height;
      }
      apartSize = apartWidth * apartHeight;
      result = -1 * Math.abs(apartSize / smallSize);
      if (result < -1) {
        result = -1;
      }
      type = 2;
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
      result = intersectSize / smallSize;
      if (result > 1) {
        result = 1;
      }
      type = 1;
    }
    // console.log(this.getRuleType()+" value:"+result);
    return result;
  }
  getPureScore(nodeA, nodeB) {
    if (typeof this.pureScore == 'undefined') {
      var value = this.getValue(nodeA, nodeB).toFixed(4, 10);
      this.pureScore = (Math.exp(value) / Math.exp(1)) * 100;
      if (this.pureScore < 1) {
        this.pureScore = 0;
      }
    }
    return this.pureScore;
  }
}
module.exports = IntersectSimilar;
