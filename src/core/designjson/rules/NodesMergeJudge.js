const ImgConbineUtils = require('./Util');
const RulesEvaluation = require('./RulesEvaluation');
const Util = require('../utils');
/**
 * 根据规则对两节点是否合并进行评分
 */
class NodesMergeJudge {
  constructor(ruleParamObj) {}
  /**
   * 组织规则参数
   * @param {QObject} ruleMap
   * @param {QObject} aiData
   * @returns {Object} ruleConfig 评分规则权重和门槛分等参数
   */
  getRuleConfig(ruleMap, aiData) {
    let ruleConfig = {};
    ruleMap.data.forEach(item => {
      ruleConfig[item.type] = {
        weight: item.value,
        requireScore: item.requireScore,
      };
      if (item.type == 'AvatarSimilar') {
        ruleConfig[item.type]['root'] = item.root;
      }
    });
    ruleConfig.score = ruleMap.Threshold || 90;
    let aiArr =
      aiData && Array.isArray(aiData.AIImgData) ? aiData.AIImgData : [];
    ruleConfig.aiArr = aiArr
      .filter(item => item.det === 'icon')
      .map(item => {
        let obj = {};
        obj.abX = Math.round(+item.x);
        obj.abY = Math.round(+item.y);
        obj.width = Math.round(+item.width);
        obj.height = Math.round(+item.height);
        obj.rate = Math.round(+item.rate);
        return obj;
      });
    return ruleConfig;
  }
  /**
   * 判断两节点是否应该合并
   * @param {QObject} node
   * @param {QObject} brother
   * @returns {Object} resultData 是否合并
   */
  isMerge(node, brother, ruleConfig, root) {
    //合图逻辑组合，如果满足其中一种组合，则认为两图层该合并
    let isCombine = false;
    let isFinally = false;

    if (
      ImgConbineUtils.findNodeByCond(
        node,
        brother,
        'name',
        '矩形 copy 8',
        '矩形 copy 16',
      )
    ) {
      console.log(1);
    }

    //如果有一个节点是长直线，则不合并
    if (ImgConbineUtils.isLine(node) || ImgConbineUtils.isLine(brother)) {
      isCombine = false;
      isFinally = true;
    }

    //如果有一个节点是红点，则不合并
    if (
      ImgConbineUtils.isRedPoint(node) ||
      ImgConbineUtils.isRedPoint(brother)
    ) {
      isCombine = false;
      isFinally = true;
    }

    //如果有一个节点是头像，则不合并
    if (ImgConbineUtils.isAvatar(node) || ImgConbineUtils.isAvatar(brother)) {
      isCombine = false;
      isFinally = true;
    }

    //avatar合图逻辑组合，如果得分低则不合
    let ruleConfig0 = this.getRuleConfig({
      data: [
        { type: 'AvatarSimilar', value: 100, requireScore: 90, root: root },
      ],
    });
    let scoreResult = this.score(node, brother, ruleConfig0);
    if (scoreResult.score < ruleConfig0.score) {
      isCombine = false;
      isFinally = true;
    }
    //symbol合图逻辑组合，如果是在同一个symbol里，则认为该合在一起。
    // if (isFinally == false) {
    //   ruleConfig0 = this.getRuleConfig({
    //     data: [{ type: 'SymbolSimilar', value: 100, requireScore: 100 }],
    //   });
    //   let scoreResult = this.score(node, brother, ruleConfig0);
    //   if (scoreResult.score >= ruleConfig0.score) {
    //     isCombine = true;
    //   }
    // }
    //如果其中一个节点是大而简单的背景，他不合并
    if (isFinally == false) {
      // ruleConfig0 = this.getRuleConfig({
      //   data: [{ type: 'CanCssSimilar', value: 100, requireScore: 76 }],
      // });
      // let scoreResult1 = this.score(node, node, ruleConfig0);

      let nodeASize = ImgConbineUtils.getSize(node);
      let widthThreshold = 339;
      let heightThreshold = 79;
      let sizeThreshold = widthThreshold * heightThreshold;
      let sizePercentThreshold = 0.4;

      if (
        ImgConbineUtils.isSimpleBackground(node) &&
        nodeASize > sizeThreshold &&
        node.width > widthThreshold &&
        node.height > heightThreshold
        // && ImgConbineUtils.isInclude(node, brother)
      ) {
        isCombine = false;
        isFinally = true;
      }

      // let scoreResult2 = this.score(brother, brother, ruleConfig0);
      let nodeBSize = ImgConbineUtils.getSize(brother);
      if (
        ImgConbineUtils.isSimpleBackground(brother) &&
        nodeBSize > sizeThreshold &&
        brother.width > widthThreshold &&
        brother.height > heightThreshold
        // && ImgConbineUtils.isInclude(brother, node)
      ) {
        isCombine = false;
        isFinally = true;
      }

      //如果节点是简单的背景，包含了另一个节点，另一节点面积比小于阈值，则不合并
      if (
        ImgConbineUtils.isSimpleBackground(node) &&
        ImgConbineUtils.isInclude(node, brother) &&
        nodeBSize / nodeASize < sizePercentThreshold
      ) {
        isCombine = false;
        isFinally = true;
      }

      if (
        ImgConbineUtils.isSimpleBackground(brother) &&
        ImgConbineUtils.isInclude(brother, node) &&
        nodeASize / nodeBSize < sizePercentThreshold
      ) {
        isCombine = false;
        isFinally = true;
      }
    }
    //面积大小合图逻辑组合，如果得分低则不合
    //处理情况2:面积大小相似，面积很大的不合在一起（处理多个用户上传图片形成的九宫格情况）
    if (isFinally == false) {
      ruleConfig0 = this.getRuleConfig({
        data: [{ type: 'SizeSimilar', value: 100, requireScore: 76 }],
      });
      let scoreResult = this.score(node, brother, ruleConfig0);
      let nodeASize = ImgConbineUtils.getSize(node);
      let nodeBSize = ImgConbineUtils.getSize(brother);
      let sizeThreshold = 10000;
      let sideThreshold = 120;
      if (
        scoreResult.score < ruleConfig0.score &&
        (nodeASize > sizeThreshold || nodeBSize > sizeThreshold)
      ) {
        isCombine = false;
        isFinally = true;
      }
      if (
        scoreResult.score > ruleConfig0.score &&
        (node.type == 'QImage' &&
          nodeASize > sizeThreshold &&
          node.width > sideThreshold &&
          node.height > sideThreshold &&
          nodeBSize > sizeThreshold &&
          brother.type == 'QImage' &&
          brother.width > sideThreshold &&
          brother.height > sideThreshold)
      ) {
        isCombine = false;
        isFinally = true;
      }
    }
    if (isFinally == false) {
      //slice合图逻辑组合
      if (isCombine == false) {
        let ruleConfig2 = this.getRuleConfig({
          data: [{ type: 'SliceSimilar', value: 50, requireScore: 100 }],
        });
        //需切换为yone给的数据
        // ruleConfig2.sliceArr = sliceArr;
        scoreResult = this.score(node, brother, ruleConfig2);
        if (scoreResult.score >= ruleConfig2.score) {
          isCombine = true;
          scoreResult = this.score(node, brother, ruleConfig2);
        }
      }
    }
    if (isFinally == false) {
      //ai合图逻辑组合
      if (isCombine == false) {
        let ruleConfig3 = this.getRuleConfig({
          data: [{ type: 'AiSimilar', value: 50, requireScore: 0 }],
        });
        //需切换为yone给的数据
        // ruleConfig3.aiArr = sliceArr;
        scoreResult = this.score(node, brother, ruleConfig3);
        if (scoreResult.score > ruleConfig3.score) {
          isCombine = true;
        }
      }
    }
    if (isFinally == false) {
      //调试工具的合图逻辑组合

      scoreResult = this.score(node, brother, ruleConfig);
      if (scoreResult.score > ruleConfig.score) {
        isCombine = true;
      }
    }

    return {
      isCombine: isCombine,
      scoreResult: scoreResult,
    };
  }

  /**
   * 获取两节点的得分
   * @param {QObject} node
   * @param {QObject} brother
   * @returns {QObject} scoreMap 得分结果数据
   */
  score(node, brother, ruleParamObj) {
    var eva = new RulesEvaluation(ruleParamObj);
    var scoreMap = eva.getEvaluationScore(node, brother);
    return scoreMap;
  }
}
module.exports = NodesMergeJudge;
