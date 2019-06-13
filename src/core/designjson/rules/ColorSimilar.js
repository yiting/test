const Rule = require('./Rule');
const Utils = require('./Util');
let minVal = 0;
var maxVal = Math.sqrt(Math.pow(255, 2) * 3);
let weight = 0.1;
/**
 * 颜色相似度规则
 * 比较两个节点的颜色属性，根据各自的r、g、b的方差求和决定颜色的差别，差值越小越相似得分越高。
 * 若节点颜色是渐变色，则取算数平均值
 * 若节点是图片、无颜色属性则不用该规则，改为用颜色复杂相似度的规则。
 */
class ColorSimilar extends Rule {
  constructor(param) {
    super(param);
    this.score = undefined;
    this.value = undefined;
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  getRuleType() {
    return this.constructor.name;
  }

  getValue(nodeA, nodeB) {
    let value = 0;
    let nodeAColor = Utils.getColorRGB(nodeA);
    let nodeBColor = Utils.getColorRGB(nodeB);
    value = Math.sqrt(
      Math.pow(nodeAColor.r - nodeBColor.r, 2) +
        Math.pow(nodeAColor.g - nodeBColor.g, 2) +
        Math.pow(nodeAColor.b - nodeBColor.b, 2),
    );
    // console.log(this.getRuleType()+" value:"+value);
    return value;
  }
  getPureScore(nodeA, nodeB) {
    if (typeof this.pureScore == 'undefined') {
      var value = this.getValue(nodeA, nodeB);
      // this.score =  (1 / (Math.sqrt(2*Math.PI)*this.maxValue) ) * Math.exp(-1*Math.pow(value,2)/(2*Math.pow(this.maxValue,2)));
      // this.score = ( (Math.exp((this.maxValue - value)/this.maxValue+5)-Math.exp(5)) /(Math.exp(6)-Math.exp(5))) * 100 * this.weight;
      // this.score = (this.maxValue - value) / this.maxValue * 100 * this.weight;
      this.pureScore =
        ((Math.pow((this.maxValue - value) / this.maxValue + 1, 5) -
          Math.pow(1, 5)) /
          (Math.pow(2, 5) - Math.pow(1, 5))) *
        100;
    }
    return this.pureScore;
  }
}
module.exports = ColorSimilar;
