const Logger = require('../logger');
const RuleMap = require('./ruleMap.json');
const ImgConbineUtils = require('../rules/Util');
const NodesMergeJudgeode = require('../rules/NodesMergeJudge.js');
// optimize模块用于优化及合并树// QNode类型，消除QMask与QShape
const { QLayer, QImage, QText, QShape } = require('../nodes');
const DesignTree = require('../nodes/DesignTree');
// const qlog = require('../log/qlog');
// const logger = qlog.getInstance(qlog.moduleData.img);
// const RulesEvaluation = require('../rules/RulesEvaluation');
const [
  Artboard,
  Group,
  Bitmap,
  Text,
  ShapeGroup,
  SymbolInstance,
  SymbolMaster,
  SliceLayer,
  Rectangle,
  Oval,
  Line,
  Triangle,
  Polygon,
  Star,
  Rounded,
  Arrow,
  ShapePath,
] = [
  'artboard',
  'group',
  'bitmap',
  'text',
  'shapeGroup',
  'symbolInstance',
  'symbolMaster',
  'slice',
  'rectangle',
  'oval',
  'line',
  'triangle',
  'polygon',
  'star',
  'rounded',
  'arrow',
  'shapePath',
];
const { walkout, isSameColor, serialize } = require('../utils');
var sliceArr = require('../rules/testData/ai.json');
var nodesMergeJudgeode = new NodesMergeJudgeode();

// [{
//     "nodes" : [nodeA,nodeB]
//     "scoreDetail" : scoreDetail
// }]
let allScoreData = [];

/**
 * 优化树的结构
 * @param {QObject} node
 */
let process = function(node, option) {
  try {
    let ruleConfig;
    if (Array.isArray(node.sliceData) && node.sliceData.length) {
      option.sliceData = node.sliceData;
      delete node.sliceData;
    }
    if (option.ruleMap) {
      ruleConfig = getRuleConfig(option.ruleMap, option);
    } else {
      ruleConfig = getRuleConfig(RuleMap, option);
    }
    // ruleConfig.aiArr = sliceArr;
    ImageMergeProcessor.init(ruleConfig);
    ImageMergeProcessor.merge(node); // 合并图片
    modifySize(node);
  } catch (err) {
    Logger.error('图元合并报错！' + err);
  }
};
class ImageMergeProcessor {
  static init(ruleConfig = {}) {
    this.RuleConfig = ruleConfig;
  }
  static merge(node) {
    // 组合成图片
    this.root = node;
    allScoreData = [];
    DesignTree.zIndexCompute(node);
    walkout(node, this._nodeMerge.bind(this));
    DesignTree.zIndexCompute(node);
  }
  static _nodeMerge(node) {
    // 规则判断
    if (node.children.length) {
      this._mergeGroupToParent(
        node.children,
        node,
        this.RuleConfig.isManualCombine,
      ); // 合图规则判断合并
      if (node.parent && node.children.length) {
        // 如果合并完有子元素，则提至祖父级
        let { parent, children } = node;
        let members = parent.children;
        let index = node.index;
        let left = members.slice(0, index);
        let right = members.slice(index + 1);
        node.children = [];
        parent.children = [...left, ...children, ...right];
        children.forEach(n => (n.parent = parent));
        node.parent = null; // node废弃
      }
    }
  }
  static _mergeGroupToParent(nodes, parent, isManualCombine = false) {
    if (!nodes || !nodes.length) return;
    const targetNodes = nodes.filter(node =>
      isManualCombine
        ? node.type !== QLayer.name
        : node.type === QShape.name || node.type === QImage.name,
    ); // 过滤掉文字节点、组节点
    if (targetNodes.length < 2) return;
    const groupArr = mergeJudge(targetNodes, this.RuleConfig, parent); // 根据规则输出 成组列表 [[node1,node2],[node3,node4],node5]
    // if (
    //   groupArr.length === 1 &&
    //   groupArr[0].size === parent.children.length &&
    //   !parent.isModified &&
    //   !parent.isRoot
    // ) {
    //   DesignTree.convert(parent, QImage.name, {
    //     saveChild: true
    //   });
    //   this.score(parent)
    //   return;
    // }
    groupArr.map(item => {
      if (item.size > 1) {
        var newnode = DesignTree.union([...item]);
        // this.score(newnode, [...item]);
      }
    });
  }
  // 抽成公共方法
  static score(parent, childrenScoreData = null) {
    parent.scoreData = this.getScoreData(
      parent._imageChildren,
      childrenScoreData,
    );
    parent.scoreMax = 0;
    parent.scoreMin = 99;
    parent.scoreData.forEach((value, key, arr) => {
      if (value.scoreDetail.score > parent.scoreMax) {
        parent.scoreMax = value.scoreDetail.score;
      }
      if (value.scoreDetail.score < parent.scoreMin) {
        parent.scoreMin = value.scoreDetail.score;
      }
    });
  }
  static getScoreData(imageChildren, childrenScoreData) {
    var scoreData = [];
    for (var i = 0, ilen = imageChildren.length; i < ilen; i++) {
      for (var j = i + 1, jlen = imageChildren.length; j < jlen; j++) {
        var item = this.getSingleScoreData(imageChildren[i], imageChildren[j]);
        if (item) {
          scoreData.push(item);
        }
      }
    }
    if (childrenScoreData) {
      childrenScoreData.forEach(function(value, key, arr) {
        if (value.scoreData && value.scoreData.length > 0) {
          scoreData = scoreData.concat(value.scoreData);
        }
      });
    }
    scoreData = this.removeDublicate(scoreData);
    return scoreData;
  }
  //数组去重
  static removeDublicate(array) {
    var tmpObj = {};
    var result = [];
    array.forEach(function(a) {
      var key = a.nodes[0].id + a.nodes[1].id;
      if (!tmpObj[key]) {
        tmpObj[key] = true;
        result.push(a);
      }
    });
    return result;
  }
  static getSingleScoreData(nodeA, nodeB) {
    for (var i = 0, ilen = allScoreData.length; i < ilen; i++) {
      var item = allScoreData[i];
      if (
        (item.nodes[0]['id'] == nodeA['id'] &&
          item.nodes[1]['id'] == nodeB['id']) ||
        (item.nodes[1]['id'] == nodeA['id'] &&
          item.nodes[0]['id'] == nodeB['id'])
      ) {
        return item;
      }
    }
    return null;
  }
  getNodesCommonColor(nodes) {
    let commonColor = null;
    for (let i = 0; i < nodes.length; i++) {
      let _color = null;
      if (nodes[i].pureColor) _color = nodes[i].pureColor;
      else return null;
      if (i === 0) commonColor = _color;
      else if (isSameColor(commonColor, _color)) continue;
      else return null;
    }
    return commonColor;
  }
}
// 裁剪越界图片
function modifySize(rootNode) {
  const images = serialize(rootNode).filter(({ type }) => type === QImage.name);
  images.forEach(img => {
    if (img.abX < 0) {
      img.width += img.abX;
      img.abX = 0;
    }
    if (img.abY < 0) {
      img.height += img.abY;
      img.abY = 0;
    }
    if (img.abXops > rootNode.abXops) {
      img.width += rootNode.abXops - img.abXops;
    }
    if (img.abYops > rootNode.abYops) {
      img.height += rootNode.abYops - img.abYops;
    }
  });
}
function mergeJudge(nodelist, ruleConfig, root) {
  // 对每条边进行评分
  let groups = [];
  let relations = [];
  const { ratio = 1 } = ruleConfig;
  for (let i = 0; i < nodelist.length; i++) {
    let node = nodelist[i];
    for (let j = i + 1; j < nodelist.length; j++) {
      let brother = nodelist[j];
      var isMergeData = nodesMergeJudgeode.isMerge({
        node,
        brother,
        ruleConfig,
        root,
        ratio,
      });
      if (isMergeData.isCombine) {
        allScoreData.push({
          nodes: [
            {
              id: node.id,
              name: node.name,
            },
            {
              id: brother.id,
              name: brother.name,
            },
          ],
          scoreDetail: isMergeData.scoreResult,
        });
        relations.push([node, brother]);
        // console.log(node.name,brother.name,'高分合图')
      }
    }
  }
  relations.map(([node, brother]) => {
    let res = [];
    // 查找当前边的两个端点是否已经成过组
    res = groups.filter(group => {
      return group.has(node) || group.has(brother);
    });
    if (res.length) {
      if (res.length > 1) {
        let unionGroup = res.reduce((p, c) => p.concat([...c]), []);
        res.forEach(g => groups.splice(groups.indexOf(g), 1));
        groups.push(new Set(unionGroup).add(node).add(brother));
      } else res[0].add(node).add(brother); // 如果已经存在组，则把节点加到原有组上
    } else groups.push(new Set([node, brother])); // 否则，自成一组
  });
  return groups;
}
function getRuleConfig(ruleMap, option) {
  const { aiData, sliceData, rate, combineLayers, isManualCombine } = option;
  let ruleConfig = {};
  ruleMap.data.forEach(item => {
    ruleConfig[item.type] = {
      weight: item.value,
      requireScore: item.requireScore,
    };
  });
  ruleConfig.score = ruleMap.Threshold || 90;
  let aiArr = aiData && Array.isArray(aiData) ? aiData : [];
  ruleConfig.ratio = rate;
  ruleConfig.aiArr = aiArr
    .filter(item => item.det === 'icon')
    .map(item => {
      let obj = {};
      obj.abX = Math.round(+item.x);
      obj.abY = Math.round(+item.y);
      obj.width = Math.round(+item.width);
      obj.height = Math.round(+item.height);
      obj.rate = parseFloat(item.probability.toFixed(2));
      return obj;
    });
  ruleConfig.sliceArr = sliceData;
  ruleConfig.combineLayers = combineLayers;
  ruleConfig.isManualCombine = isManualCombine;
  return ruleConfig;
}
module.exports = process;
