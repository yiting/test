const ColorSimilar = require('./ColorSimilar');
const ColorComplexitySimilar = require('./ColorComplexitySimilar');
const SizeSimilar = require('./SizeSimilar');
const IntersectSimilar = require('./IntersectSimilar');
const ZIndexSimilar = require('./ZIndexSimilar');
const MinLevelSimilar = require('./MinLevelSimilar');
const SymbolSimilar = require('./SymbolSimilar');
const AvatarSimilar = require('./AvatarSimilar');
const SliceSimilar = require('./SliceSimilar');
const AiSimilar = require('./AiSimilar');
const CanCssSimilar = require('./CanCssSimilar');
const Util = require('./Util');
const Rules = {
  ColorSimilar: 'ColorSimilar',
  SizeSimilar: 'SizeSimilar',
  IntersectSimilar: 'IntersectSimilar',
  ZIndexSimilar: 'ZIndexSimilar',
  MinLevelSimilar: 'MinLevelSimilar',
  ColorComplexitySimilar: 'ColorComplexitySimilar',
  SymbolSimilar: 'SymbolSimilar',
  AvatarSimilar: 'AvatarSimilar',
  SliceSimilar: 'SliceSimilar',
  AiSimilar: 'AiSimilar',
  CanCssSimilar: 'CanCssSimilar',
};

/**
 * 根据规则对两节点是否合并进行评分
 */
class RulesEvaluation {
  constructor(ruleParamObj) {
    this.rules = {
      ColorSimilar: new ColorSimilar(ruleParamObj.ColorSimilar),
      SizeSimilar: new SizeSimilar(ruleParamObj.SizeSimilar),
      IntersectSimilar: new IntersectSimilar(ruleParamObj.IntersectSimilar, {
        ratio: ruleParamObj.ratio,
      }),
      ZIndexSimilar: new ZIndexSimilar(ruleParamObj.ZIndexSimilar),
      MinLevelSimilar: new MinLevelSimilar(ruleParamObj.MinLevelSimilar),
      ColorComplexitySimilar: new ColorComplexitySimilar(
        ruleParamObj.ColorComplexitySimilar,
      ),
      SymbolSimilar: new SymbolSimilar(ruleParamObj.SymbolSimilar),
      AvatarSimilar: new AvatarSimilar(ruleParamObj.AvatarSimilar),
      SliceSimilar: new SliceSimilar(ruleParamObj.SliceSimilar),
      AiSimilar: new AiSimilar(ruleParamObj.AiSimilar),
      CanCssSimilar: new CanCssSimilar(ruleParamObj.CanCssSimilar),
    };
    this.setWeight(this.translateWeight(ruleParamObj));
    this.sliceArr = ruleParamObj.sliceArr || [];
    this.aiArr = ruleParamObj.aiArr || [];
    this.scoreDetail = {};
    this.pureScoreDetail = {};
    this.ratio = ruleParamObj.ratio || 1;
  }
  /**
   * 检查两个节点是否能用颜色相似度规则，当两个节点都存在颜色数据才能使用颜色相似度规则
   * @param {QObject} nodeA
   * @param {QObject} nodeB
   * @returns {Boolean} result
   */
  canUseColorSimilar(nodeA, nodeB) {
    let result = true;
    let nodeAColor = Util.getColorRGB(nodeA);
    let nodeBColor = Util.getColorRGB(nodeB);
    if (typeof nodeAColor == 'undefined' || typeof nodeBColor == 'undefined') {
      result = false;
    }
    return result;
  }
  /**
   * 设置规则的权重
   * @param {Object} ruleParamObj
   */
  setWeight(ruleParamObj) {
    var that = this;
    for (let ruleType in that.rules) {
      that.rules[ruleType].setWeight(ruleParamObj[ruleType]['weight']);
    }
  }
  /**
   * 获取两节点的相似度得分
   * @param {QObject} nodeA
   * @param {QObject} nodeB
   * @returns {Float} score
   */
  getEvaluationScore(nodeA, nodeB) {
    var that = this;
    var score = 0;
    for (let ruleType in Rules) {
      var rule = that.rules[ruleType];
      var singleScore = 0;
      var pureScore = 0;
      if (rule.getWeight() > 0) {
        if (rule.getRuleType() == 'ColorSimilar') {
          if (this.canUseColorSimilar(nodeA, nodeB)) {
            singleScore = parseFloat(rule.getScore(nodeA, nodeB).toFixed(2));
            pureScore = parseFloat(rule.getPureScore(nodeA, nodeB).toFixed(2));
          } else {
            // singleScore = parseFloat((rule.getWeight()*100).toFixed(2));
            singleScore = 0;
            pureScore = 0;
          }
        } else if (rule.getRuleType() == 'SliceSimilar') {
          singleScore = parseFloat(
            rule.getScore(nodeA, nodeB, this.sliceArr).toFixed(2),
          );
          pureScore = parseFloat(rule.getPureScore(nodeA, nodeB).toFixed(2));
        } else if (rule.getRuleType() == 'AiSimilar') {
          singleScore = parseFloat(
            rule.getScore(nodeA, nodeB, this.aiArr).toFixed(2),
          );
          pureScore = parseFloat(rule.getPureScore(nodeA, nodeB).toFixed(2));
        } else {
          singleScore = parseFloat(rule.getScore(nodeA, nodeB).toFixed(2));
          pureScore = parseFloat(rule.getPureScore(nodeA, nodeB).toFixed(2));
        }
        this.scoreDetail[rule.getRuleType()] = singleScore;
        this.pureScoreDetail[rule.getRuleType()] = pureScore;
        score += singleScore;
      }
      // console.log(rule.getRuleType()+" score:"+singleScore);
    }
    score = parseFloat(score.toFixed(2));
    // if(score>0){
    //     console.log(nodeA.name+"  与  "+nodeB.name+" 合图得分");
    //     console.warn("total Score :"+score+"\n");
    // }
    return {
      score: score,
      detail: this.scoreDetail,
      pureDetail: this.pureScoreDetail,
    };
  }
  /**
   * 将各规则设置的0~100的权重转换为占总权重的百分比
   * @param {Object} ruleParamObj
   * @returns {Object} resultObj
   */
  translateWeight(ruleParamObj) {
    var totalWeight = 0;
    var resultObj = {};
    var that = this;
    for (let ruleType in that.rules) {
      var singeWeight = 0;
      if (ruleParamObj[ruleType]) {
        singeWeight = parseFloat(ruleParamObj[ruleType]['weight']);
      }
      resultObj[ruleType] = {};
      resultObj[ruleType]['weight'] = singeWeight;
      totalWeight += singeWeight;
    }
    for (let ruleType in resultObj) {
      resultObj[ruleType]['weight'] =
        resultObj[ruleType]['weight'] / totalWeight;
    }
    return resultObj;
  }
}
module.exports = RulesEvaluation;
