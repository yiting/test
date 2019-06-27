const Rule = require('./Rule');
const Util = require('./Util');
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
const Util2 = require('../utils');
const ImgConbineUtils = require('./Util');
let weight = 1;

/**
 * avatar相似度规则
 * 比较两个节点是否都是同一种形状（正方形/圆形），是否图形中心在同一水平线，面积是否小于某个值（用于处理紧挨的头像不做处理、紧挨的信号圆点应该合在一起），若为是则得分高。
 */
class AvatarSimilar extends Rule {
  constructor(param) {
    super(param);
    this.score = undefined;
    this.value = undefined;
    if (param && param.root) {
      this.root = param.root;
    }
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  getRuleType() {
    return this.constructor.name;
  }
  getShapeType(node) {
    var type;
    if (typeof node.shapeType != 'undefined') {
      type = 'symbol';
    } else {
      type = 'normal';
    }
    return type;
  }
  getValue(nodeA, nodeB) {
    let nodeAType = this.getShapeType(nodeA);
    let nodeBType = this.getShapeType(nodeB);
    let value = 1;
    if (this.isHorizonAvatar(nodeA, nodeB)) {
      value = 0;
    } else if (this.isVerticalAvatar(nodeA, nodeB)) {
      value = 0;
    }

    return value;
  }

  isHorizonAvatar(nodeA, nodeB) {
    let nodeAHalfY = nodeA.abY + nodeA.height / 2;
    let nodeBHalfY = nodeB.abY + nodeB.height / 2;
    let HalfYGap = Math.abs(nodeBHalfY - nodeAHalfY);
    // 比较两个节点是否小于某个值
    let nodeASize = Util.getSize(nodeA);
    let nodeBSize = Util.getSize(nodeB);
    let sizeThreshold = 64 * 64;
    let result = false;
    // 比较两个节点是否都是同一种形状
    if (
      nodeA.shapeType == nodeB.shapeType &&
      HalfYGap < 10 &&
      (nodeASize >= sizeThreshold || nodeBSize >= sizeThreshold) &&
      ImgConbineUtils.isIntersect(nodeA, nodeB) ==
        ImgConbineUtils.INTERSECT_TYPE.DISJOINT
    ) {
      result = true;
    } else if (
      nodeA.shapeType == nodeB.shapeType &&
      HalfYGap < 10 &&
      this.root &&
      Util2.hasText(nodeA, this.root) &&
      Util2.hasText(nodeB, this.root)
    ) {
      result = true;
    }
    return result;
  }

  isVerticalAvatar(nodeA, nodeB) {
    let nodeAHalfY = nodeA.abX + nodeA.width / 2;
    let nodeBHalfY = nodeB.abX + nodeB.width / 2;
    let HalfYGap = Math.abs(nodeBHalfY - nodeAHalfY);
    // 比较两个节点是否小于某个值
    let nodeASize = Util.getSize(nodeA);
    let nodeBSize = Util.getSize(nodeB);
    let sizeThreshold = 64 * 64;
    let result = false;
    // 比较两个节点是否都是同一种形状
    if (
      nodeA.shapeType == nodeB.shapeType &&
      HalfYGap < 10 &&
      (nodeASize >= sizeThreshold || nodeBSize >= sizeThreshold) &&
      ImgConbineUtils.isIntersect(nodeA, nodeB) ==
        ImgConbineUtils.INTERSECT_TYPE.DISJOINT
    ) {
      result = true;
    } else if (
      nodeA.shapeType == nodeB.shapeType &&
      HalfYGap < 10 &&
      Util2.hasText(nodeA, this.root) &&
      Util2.hasText(nodeB, this.root)
    ) {
      result = true;
    }
    return result;
  }

  //获得分数（不包含权重）
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
module.exports = AvatarSimilar;
