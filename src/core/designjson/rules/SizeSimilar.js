const Rule = require('./Rule');
const Utils = require('./Util');
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
let weight = 0.1;
/**
 * 面积大小相似度的规则
 * 计算两节点的面积比（小除以大），越接近1得分越高
 */
class SizeSimilar extends Rule {
  constructor(param) {
    super(param);
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  getRuleType() {
    return this.constructor.name;
  }
  getValue(nodeA, nodeB) {
    let nodeASize = Utils.getSize(nodeA);
    let nodeBSize = Utils.getSize(nodeB);
    let percent;
    if (nodeASize > nodeBSize) {
      percent = nodeBSize / nodeASize;
    } else {
      percent = nodeASize / nodeBSize;
    }
    // console.log(this.getRuleType()+" value:"+percent);
    return percent;
  }
  getPureScore(nodeA, nodeB) {
    if (typeof this.pureScore == 'undefined') {
      var value = parseFloat(this.getValue(nodeA, nodeB).toFixed(4)) + 0.6; //值调整
      if (value > 1) {
        value = 1;
      }
      this.pureScore =
        ((Math.pow(value + 1, 5) - Math.pow(1, 5)) /
          (Math.pow(2, 5) - Math.pow(1, 5))) *
        100;
    }
    return this.pureScore;
  }
}
module.exports = SizeSimilar;
