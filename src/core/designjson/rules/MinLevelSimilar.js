const Rule = require('./Rule');
const Utils = require('./Util');
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
let weight = 1;
/**
 * 最小公共父目录层级相似度的规则
 * 计算两节点的最小公共父目录的层级，层级相差越小得分越高
 */
class MinLevelSimilar extends Rule {
  constructor(param) {
    super(param);
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  getRuleType() {
    return this.constructor.name;
  }
  getValue(nodeA, nodeB) {
    let nodeALevelArr = [];
    let nodeBLevelArr = [];
    let value = 0;
    Object.assign(nodeALevelArr, Utils.getLevelArr(nodeA));
    Object.assign(nodeBLevelArr, Utils.getLevelArr(nodeB));
    // console.log(JSON.stringify(nodeALevelArr) + "   " + JSON.stringify(nodeBLevelArr));
    if (nodeALevelArr.length == 0 || nodeBLevelArr.length == 0) {
      return value;
    }
    nodeALevelArr.unshift(1);
    nodeBLevelArr.unshift(1);
    let minParentIndex;
    let maxLevelLength = Math.max(nodeALevelArr.length, nodeBLevelArr.length);
    for (var i = 0, ilen = maxLevelLength; i < ilen; i++) {
      if (nodeALevelArr[i] != nodeBLevelArr[i]) {
        minParentIndex = i - 1;
        break;
      }
    }
    let minNodeAParentDistance = nodeALevelArr.length - 1 - minParentIndex;
    let minNodeBParentDistance = nodeBLevelArr.length - 1 - minParentIndex;

    value = minNodeAParentDistance + minNodeBParentDistance - 2;

    let percent = 1 - value / 10;
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
module.exports = MinLevelSimilar;
