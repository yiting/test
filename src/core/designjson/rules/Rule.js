class Rule {
  constructor(param) {
    this.minVal = 0;
    this.maxVal = 0;
    this.weight = 0;
    this.pureScore = undefined;
    this.score = undefined;
    this.value = undefined;
    //规则的门槛分
    this.requireScore =
      param && param.requireScore ? parseFloat(param.requireScore) : 0;
    this.weight = param && param.weight ? param.weight : 0;
  }

  static getRuleType() {}
  //获得分数（不包含权重）
  getPureScore(nodeA, nodeB) {
    this.pureScore = 0;
    return this.pureScore;
  }
  //获得分数（包含权重）
  getScore(nodeA, nodeB) {
    if (typeof this.pureScore == 'undefined') {
      this.pureScore = this.getPureScore(nodeA, nodeB);
    }
    //如果不超过门槛分，则只得0分
    if (!this.isPass(nodeA, nodeB)) {
      this.score = 0.01;
    } else {
      this.score = this.pureScore * this.weight;
    }
    return this.score;
  }
  //判断是否超过门槛分
  isPass(nodeA, nodeB) {
    var result = false;
    if (typeof this.pureScore == 'undefined') {
      this.pureScore = this.getPureScore(nodeA, nodeB);
    }
    if (this.pureScore >= this.requireScore) {
      result = true;
    }
    return result;
  }
  setWeight(weight) {
    this.weight = weight;
  }
  getWeight() {
    return this.weight;
  }
}
module.exports = Rule;
