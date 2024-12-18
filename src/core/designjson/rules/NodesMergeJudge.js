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
    let ratio = ruleMap.ratio;
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
    ruleConfig.ratio = ruleMap.ratio || 1;
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
  isMerge(param) {
    let { node, brother, ruleConfig, root, ratio = 1 } = param;
    let combineLayers = ruleConfig.combineLayers;
    let isManualCombine = ruleConfig.isManualCombine;
    //合图逻辑组合，如果满足其中一种组合，则认为两图层该合并
    let isCombine = false;
    let isFinally = false;

    if (node.id.indexOf('5BF4D936-80A2-4C83-9A19-EDBD8E5B2C49') > -1) {
      // console.log(1);
    }

    if (isManualCombine) {
      return this.isMergeByPreedit(param);
    }

    // if (
    //   ImgConbineUtils.findNodeByCond(
    //     node,
    //     brother,
    //     'id',
    //     "4D2975A0-200D-4554-99C7-381DCFFC4A0C",
    //     "4DA4C44B-158A-434F-95C7-D0E077255954"
    //   )
    // ) {
    //   console.log(1);
    // }

    // if(brother.id.indexOf("4D2975A0-200D-4554-99C7-381DCFFC4A0C")>-1){
    //   console.log(1);
    // }

    // if(node.id.indexOf("4D2975A0-200D-4554-99C7-381DCFFC4A0C")>-1){
    //   console.log(1);
    // }

    if (isFinally == false) {
      //slice合图逻辑组合
      if (isCombine == false && typeof ruleConfig.sliceArr != 'undefined') {
        let ruleConfig2 = this.getRuleConfig({
          data: [{ type: 'SliceSimilar', value: 50, requireScore: 100 }],
          ratio: ratio,
        });
        //需切换为yone给的数据
        ruleConfig2.sliceArr = ruleConfig.sliceArr;
        var scoreResult = this.score(node, brother, ruleConfig2);
        if (scoreResult.score >= ruleConfig2.score) {
          isCombine = true;
          isFinally = true;
          scoreResult = this.score(node, brother, ruleConfig2);
        } else if (scoreResult.score == 0) {
          //在不同的slice里面的情况
          isCombine = false;
          isFinally = true;
        }
        if (
          (node.id.indexOf('4D2975A0-200D-4554-99C7-381DCFFC4A0C') > -1 ||
            brother.id.indexOf('4D2975A0-200D-4554-99C7-381DCFFC4A0C') > -1) &&
          isCombine == true
        ) {
          console.log(1);
        }
      }
    }

    //ai合图逻辑组合
    if (isFinally == false) {
      if (
        isCombine == false &&
        ruleConfig.aiArr &&
        ruleConfig.aiArr.length > 0
      ) {
        let ruleConfig2 = this.getRuleConfig({
          data: [{ type: 'AiSimilar', value: 50, requireScore: 80 }],
          ratio: ratio,
        });
        //需切换为yone给的数据
        ruleConfig2.aiArr = ruleConfig.aiArr;
        var scoreResult = this.score(node, brother, ruleConfig2);
        if (scoreResult.score >= ruleConfig2.score) {
          isCombine = true;
          isFinally = true;
          scoreResult = this.score(node, brother, ruleConfig2);
        }
      }
    }

    //如果有一个节点是长直线，则不合并
    if (isFinally == false) {
      if (ImgConbineUtils.isLine(node) || ImgConbineUtils.isLine(brother)) {
        isCombine = false;
        isFinally = true;
      }
    }

    //如果有一个是气泡图片，则不合并
    if (isFinally == false) {
      if (ImgConbineUtils.isBubble(node) || ImgConbineUtils.isBubble(brother)) {
        isCombine = false;
        isFinally = true;
      }
    }

    //如果有一个节点是红点，则不合并
    if (isFinally == false) {
      if (
        ImgConbineUtils.isRedPoint(node) ||
        ImgConbineUtils.isRedPoint(brother)
      ) {
        isCombine = false;
        isFinally = true;
      }
    }

    //如果有一个节点是头像，则不合并
    if (isFinally == false) {
      if (ImgConbineUtils.isAvatar(node) || ImgConbineUtils.isAvatar(brother)) {
        isCombine = false;
        isFinally = true;
      }
    }

    //avatar合图逻辑组合，如果得分低则不合
    let ruleConfig0;
    if (isFinally == false) {
      ruleConfig0 = this.getRuleConfig({
        data: [
          { type: 'AvatarSimilar', value: 100, requireScore: 90, root: root },
        ],
        ratio: ratio,
      });
      let scoreResult = this.score(node, brother, ruleConfig0);
      if (scoreResult.score < ruleConfig0.score) {
        isCombine = false;
        isFinally = true;
      }
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

    //如果其中一个是symbolInstance，则不合并
    let isNodeSymbolInstance = ImgConbineUtils.isSymbolInstance(node);
    let isBrotherSymbolInstance = ImgConbineUtils.isSymbolInstance(brother);
    if (isFinally == false) {
      if (
        (isNodeSymbolInstance && !isBrotherSymbolInstance) ||
        (!isNodeSymbolInstance && isBrotherSymbolInstance)
      ) {
        isCombine = false;
        isFinally = true;
      }
    }

    //如果其中一个节点是大而简单的背景，则不合并
    if (isFinally == false) {
      // ruleConfig0 = this.getRuleConfig({
      //   data: [{ type: 'CanCssSimilar', value: 100, requireScore: 76 }],
      // });
      // let scoreResult1 = this.score(node, node, ruleConfig0);

      var nodeASize = ImgConbineUtils.getSize(node);
      var widthThreshold = 342 * ratio;
      var heightThreshold = 69 * ratio;
      var sizeThreshold = widthThreshold * heightThreshold;
      var sizePercentThreshold = 0.38;

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
      var nodeBSize = ImgConbineUtils.getSize(brother);
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

      //如果节点是简单的背景，包含了另一个节点，另一节点是图片（多用于用户头像），面积比小于阈值，则不合并
      if (
        ImgConbineUtils.isSimpleBackground(node) &&
        ImgConbineUtils.isIntersect(node, brother) ==
          ImgConbineUtils.INTERSECT_TYPE.INCLUDE &&
        nodeBSize / nodeASize < sizePercentThreshold &&
        ImgConbineUtils.isImage(brother)
      ) {
        isCombine = false;
        isFinally = true;
      }

      if (
        ImgConbineUtils.isSimpleBackground(brother) &&
        ImgConbineUtils.isIntersect(brother, node) ==
          ImgConbineUtils.INTERSECT_TYPE.INCLUDE &&
        nodeASize / nodeBSize < sizePercentThreshold &&
        ImgConbineUtils.isImage(node)
      ) {
        isCombine = false;
        isFinally = true;
      }

      //如果节点是大背景，包含了另一个节点，另一节点面积比小于阈值，则不合并
      //分横背景和竖背景
      //宽度 194 更新自游戏城的好友热玩右边的模糊图
      //高度 83 更新自小说设计稿的礼包领取气泡高度
      //面积比 0.12 更新自小说设计稿的礼包领取气泡与按钮的面积比
      let sizePercentThresholdForNormalBg = 0.12;
      let horizonBgWidthThreshold = 685 * ratio;
      let horizonBgHeightThreshold = 83 * ratio;
      let verticalBgWidthThreshold = 194 * ratio;
      let verticalBgHeightThreshold = 285 * ratio;
      let includeThreshold = 3;
      if (
        ImgConbineUtils.isIntersect(node, brother, includeThreshold) ==
          ImgConbineUtils.INTERSECT_TYPE.INCLUDE &&
        ((node.width > horizonBgWidthThreshold &&
          node.height > horizonBgHeightThreshold) ||
          (node.width > verticalBgWidthThreshold &&
            node.height > verticalBgHeightThreshold)) &&
        nodeBSize / nodeASize < sizePercentThresholdForNormalBg
      ) {
        isCombine = false;
        isFinally = true;
      }
      if (
        ImgConbineUtils.isIntersect(brother, node) ==
          ImgConbineUtils.INTERSECT_TYPE.INCLUDE &&
        ((brother.width > horizonBgWidthThreshold &&
          brother.height > horizonBgHeightThreshold) ||
          (brother.width > verticalBgWidthThreshold &&
            brother.height > verticalBgHeightThreshold)) &&
        nodeASize / nodeBSize < sizePercentThresholdForNormalBg
      ) {
        isCombine = false;
        isFinally = true;
      }
    }
    //如果其中一个是一个大的边框，则不与它包含的里面的东西的合在一起
    //例子：红色任务中心的右上角商城和圆框
    let borderWidthThreshold = 150;
    let borderHeightThreshold = 44;
    if (isFinally == false) {
      if (
        ImgConbineUtils.isOnlyBorder(node) &&
        node.width > borderWidthThreshold &&
        node.height > borderHeightThreshold &&
        nodeBSize / nodeASize < sizePercentThreshold
      ) {
        isCombine = false;
        isFinally = true;
      } else if (
        ImgConbineUtils.isOnlyBorder(brother) &&
        brother.width > borderWidthThreshold &&
        brother.height > borderHeightThreshold &&
        nodeASize / nodeBSize < sizePercentThreshold
      ) {
        isCombine = false;
        isFinally = true;
      }
    }

    //面积大小合图逻辑组合，如果得分低则不合
    //处理情况2:面积大小相似，面积很大，不合在一起（处理多个用户上传图片形成的九宫格情况）
    if (isFinally == false) {
      ruleConfig0 = this.getRuleConfig({
        data: [{ type: 'SizeSimilar', value: 100, requireScore: 76 }],
        ratio: ratio,
      });
      let scoreResult = this.score(node, brother, ruleConfig0);
      let nodeASize = ImgConbineUtils.getSize(node);
      let nodeBSize = ImgConbineUtils.getSize(brother);
      let sizeThreshold = 10000;
      let sideThreshold = 120 * ratio;
      //处理情况1
      // if (
      //   scoreResult.score < ruleConfig0.score &&
      //   (nodeASize > sizeThreshold || nodeBSize > sizeThreshold) //&& !(ImgConbineUtils.isIntersect(brother,node) == ImgConbineUtils.INTERSECT_TYPE.INCLUDE  || ImgConbineUtils.isIntersect(node, brother) == ImgConbineUtils.INTERSECT_TYPE.INCLUDE )
      // ) {
      //   isCombine = false;
      //   isFinally = true;
      // }
      //处理情况2
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

    // if (isFinally == false) {
    //   //ai合图逻辑组合
    //   if (isCombine == false) {
    //     let ruleConfig3 = this.getRuleConfig({
    //       data: [{ type: 'AiSimilar', value: 50, requireScore: 0 }],
    //     });
    //     //需切换为yone给的数据
    //     // ruleConfig3.aiArr = sliceArr;
    //     scoreResult = this.score(node, brother, ruleConfig3);
    //     if (scoreResult.score > ruleConfig3.score) {
    //       isCombine = true;
    //     }
    //   }
    // }
    if (isFinally == false) {
      //调试工具的合图逻辑组合
      if (
        ImgConbineUtils.findNodeByCond(
          node,
          brother,
          'id',
          'C80AE7A7-34D4-4F87-AB75-9B0C3887F90D',
          'A8EEA0B0-A80D-47E4-AD50-291413A8D248',
        )
      ) {
        console.log(2);
      }
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
   * 预处理环节判断两节点是否应该合并
   * 根据平台传来的组合id来判断是否该合并
   * @param {QObject} node
   * @param {QObject} brother
   * @returns {Object} resultData 是否合并
   */
  isMergeByPreedit(param) {
    let { node, brother, ruleConfig } = param;
    let combineLayers = ruleConfig.combineLayers;
    var isCombine = false;
    for (var i = 0, ilen = combineLayers.length; i < ilen; i++) {
      var isFindNode = false;
      var isFindBrother = false;
      var itemArr = combineLayers[i];
      for (var j = 0, jlen = itemArr.length; j < jlen; j++) {
        if (itemArr[j] == node.id) {
          isFindNode = true;
        } else if (itemArr[j] == brother.id) {
          isFindBrother = true;
        }
      }
      if (isFindNode && isFindBrother) {
        isCombine = true;
        break;
      }
    }
    return {
      isCombine: isCombine,
      scoreResult: 0,
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
