const Rule = require('./Rule');
const Utils = require('./Util');
let minVal = 10;
var maxVal = 20;
let weight = 1;
const qlog = require('../../log/qlog');
let logger = qlog.getInstance(qlog.moduleData.img);
/**
 * 颜色复杂相似度的规则
 * 颜色复杂度的意思是节点包含的颜色丰富度，例如图标一般是单色纯色，一些图片是渐变色或者颜色丰富复杂。
 * 若两节点的颜色复杂度相似，则得分高
 */
class ColorComplexitySimilar extends Rule {
  constructor(param) {
    super(param);
    this.score = undefined;
    this.value = undefined;
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  getColorLength(node) {
    var background = node.styles.background;
    var colorLength = 0;
    if (background.type == 'color') {
      colorLength = 1;
    } else {
      colorLength = background.colorStops.length;
    }
    return colorLength;
  }
  getRuleType() {
    return this.constructor.name;
  }
  canUseRule(node) {
    let result = true;
    try {
      if (
        node.type != 'QShape' ||
        (!node.styles.background || !node.styles.background.type) ||
        (node.type == 'QShape' &&
          node.styles.background &&
          node.styles.background.type == 'image')
      ) {
        result = false;
      }
    } catch (err) {
      logger.err(err);
    }
    return result;
  }
  getValue(nodeA, nodeB) {
    let nodeAType = nodeA.type;
    let nodeBType = nodeB.type;
    var value = 0;
    var percent = 0;
    if (this.canUseRule(nodeA) && this.canUseRule(nodeB)) {
      value = Math.abs(this.getColorLength(nodeA) - this.getColorLength(nodeB));
    } else {
      value = maxVal;
    }
    percent = 1 - value / maxVal;
    // console.log(this.getRuleType()+" value:"+percent);
    return percent;
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
module.exports = ColorComplexitySimilar;
