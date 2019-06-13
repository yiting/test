const Rule = require('./Rule');
const Util = require('./Util');
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
let weight = 1;
/**
 * 是否能用css实现的规则
 * 若节点能用css实现，则不该合并
 */
class CanCssSimilar extends Rule {
  constructor(param) {
    super(param);
    this.score = undefined;
    this.value = undefined;
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  isLine(node) {
    var result = false;
    if (node.width > 50 && node.height <= 2) {
      result = true;
    }
    return result;
  }
  getRuleType() {
    return this.constructor.name;
  }
  canCss(node) {
    let result = true;
    //如果形状是矩形、圆形、直线以外的就不能css实现
    if (
      !(
        (node.shapeType == 'rectangle' &&
          node._origin.points &&
          node._origin.points.length == 4 &&
          node._origin.points[0]._class == 'point') ||
        ((node.shapeType == 'oval' ||
          node.name.toLowerCase().indexOf('oval') > -1) &&
          node.width == node.height &&
          (typeof node._origin.layers == 'undefined' ||
            (node._origin.layers && node._origin.layers.length < 2))) ||
        (node.width > 50 && node.height <= 2)
      )
    ) {
      result = false;
    }
    //如果图片则不能css实现
    if (result && node._origin._class == 'bitmap') {
      result = false;
    }
    //如果fill属性是linear/color/radical之外则不能css实现
    if (
      result &&
      node.styles.background &&
      !(
        node.styles.background.type == 'linear' ||
        node.styles.background.type == 'color' ||
        node.styles.background.type == 'radical'
      )
    ) {
      result = false;
    }

    //如果该节点下有多个子节点组成，则不能css实现
    if (result && node._origin.layers && node._origin.layers.length > 1) {
      result = false;
    }

    //如果父节点有旋转等对整体进行处理的属性时，则认为该父节点下的节点需要合并，不能用css实现
    var parent = node.parent;
    if (result && parent && parent.styles && parent.styles.rotation != 0) {
      result = false;
    }

    return result;
  }
  getValue(nodeA, nodeB) {
    let value = 1;
    var nodeAName = '矩形 copy 12';
    var nodeBName = '矩形';
    if (
      (nodeA.name == nodeAName && nodeB.name == nodeBName) ||
      (nodeA.name == nodeBName && nodeB.name == nodeAName)
    ) {
      console.log(1);
    }
    if (this.canCss(nodeA) && this.canCss(nodeB)) {
      value = 0;
    } else if (this.canCss(nodeA) || this.canCss(nodeB)) {
      value = 0.7;
    }
    if (this.isLine(nodeA) || this.isLine(nodeB)) {
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
module.exports = CanCssSimilar;
