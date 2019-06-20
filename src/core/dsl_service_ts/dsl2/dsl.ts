// dsl模块
//
// dsl的核心思路:
// 匹配网页上的设计形态
import Common from './common';
import Manager from './manager';
import Model from './model';
import Utils from './utils';

import Store from '../helper/store';
import QLog from '../log/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);

/**
 * dsl的使用入口
 * 传入designjson节点,并返回MatchData
 * @param {Array} nodes
 * @return {Array} <MatchData>
 */
let pipe = function(nodes: any) {
  let res: any[] = [];

  if (!nodes || !nodes.length || nodes.length === 0) {
    return res;
  }

  // 生成一些配置用参数
  Common.DesignWidth = nodes[0].width;
  Common.DesignHeight = nodes[0].height;

  let maxNodeX = 0; // 用于将空间分割的辅助参数
  let maxNodeY = 0; // 用于将空间分割的辅助参数
  let matchingNodes: any[] = []; // 需要进行匹配的节点
  let matchedElements: any[] = []; // 匹配完毕的元素模型
  let matchedElementX: any[] = []; // 可变节点模型
  let matchedWidgets: any[] = []; // 匹配完毕的组件模型
  let matchedSymbols: any[] = []; // 匹配完毕的自定义组件
  const optimizeWidth = Store.get('optimizeWidth') * 2; // 这里*2是增加获取数据的范围, 防止超出设计稿外的元素没被匹配
  const optimizeHeight = Store.get('optimizeHeight');
  const layoutType = Store.get('layoutType');

  // 节点匹配前的
  nodes.forEach((item: any, index: number) => {
    maxNodeX = maxNodeX > item.abX ? maxNodeX : item.abX;
    maxNodeY = maxNodeY > item.abY ? maxNodeY : item.abY;
    item.zIndex = item.zIndex > 0 ? item.zIndex : index; // 默认zIndex的值, 越大显示层级越高

    switch (item.type) {
      case 'QShape':
        item.type = Common.QShape;
        matchingNodes.push(item);
        break;
      case 'QImage':
        if (item.width <= Common.IconSize && item.height <= Common.IconSize) {
          item.type = Common.QIcon;
        } else {
          item.type = Common.QImage;
        }
        matchingNodes.push(item);
        break;
      case 'QText':
        item.type = Common.QText;
        matchingNodes.push(item);
        break;
      default:
        console.log('nodes分类遇到没有对应类型的节点');
    }
  });

  // 匹配元素模型
  try {
    _matchModels(
      10000,
      matchedElements,
      matchingNodes,
      Common.MatchingElements,
      optimizeWidth,
      optimizeHeight,
      maxNodeX,
      maxNodeY,
    );
  } catch (e) {
    console.log('match element error');
    // Loger.error(`dsl/dsl.ts pipe()
    //         desc:匹配元素
    //         error:${e}`);
  }

  // 剩下因各种情况未能匹配的,变成基础元素模型
  if (matchingNodes.length > 0) {
    try {
      Manager.matchElementBase(matchingNodes, matchedElements);
    } catch (e) {
      console.log('match base error');
    }
  }

  // 进行可变元素模型的处理
  try {
    _matchModels(
      10000,
      matchedElementX,
      matchedElements,
      Common.MatchingElementX,
      optimizeWidth,
      optimizeHeight,
      maxNodeX,
      maxNodeY,
    );
  } catch (e) {
    console.log('match elementX error');
  }

  for (let i = 0; i < matchedElementX.length; i++) {
    console.log(matchedElementX[i]);
  }
  console.log('可变节点模型个数: ' + matchedElementX.length);

  // // 匹配组件模型
  // try {
  //   _matchModels(10000, matchedWidgets, matchedElements, Common.MatchingWidgets, optimizeWidth, optimizeHeight, maxNodeX, maxNodeY);
  // } catch (e) {
  //   console.log('match widget error');
  // }
  // console.log('组件匹配-元素模型匹配后数量: ' + matchedElements.length);
  // console.log('组件模型匹配的长度: ' + matchedWidgets.length);
  // Utils.logWidgetInfo(matchedWidgets);
};

/**
 * 函数用于匹配元素模型或组件模型
 * @param {Int} matchTimes 运行的次数, 防止计算超时间 100000
 * @param {Array} matchedNodes 匹配好的模型存放数组
 * @param {Array} nodes 需要进行匹配的数组
 * @param {Int} mType 匹配的类型, 元素匹配或组件匹配
 * @param {Int} optimizeWidth 用于优化的范围宽
 * @param {Int} optimizeHeight 用于优化的范围长
 * @param {Int} maxX 节点所组成的最长宽度, 用于降低节点匹配计算量
 * @param {Int} maxY 节点所组成的最长高度, 用于降低节点匹配计算量
 */
let _matchModels = function(
  matchTimes: number,
  matchedNodes: any[],
  nodes: any[],
  mType: any,
  optimizeWidth: number,
  optimizeHeight: number,
  maxX: number,
  maxY: number,
) {
  if (!nodes || !nodes.length || nodes.length === 0 || matchTimes <= 0) {
    return;
  }

  let beginX: number = 0;
  let beginY: number = 0;
  let nowTimes: number = 0;

  while (nowTimes < matchTimes) {
    nowTimes++;
    if (nowTimes >= matchTimes) {
      console.log('重要: 节点匹配计算量超过matchTimes上限!');
    }

    // 需要匹配的节点
    let mNodes: any[] = Utils.getNodesFromSize(
      nodes,
      beginX,
      beginY,
      optimizeWidth,
      optimizeHeight,
    );

    let result: any[];
    if (mNodes && mNodes.length > 0) {
      if (mType === Common.MatchingElementX) {
        // 可变元素的匹配
        result = Manager.matchElementX(mNodes, beginY + optimizeHeight);
      } else {
        // 普通的匹配
        result = Manager.matchModel(mNodes, mType, beginY + optimizeHeight);
      }
    }

    if (result && result.length > 0) {
      result.forEach((item: any) => {
        matchedNodes.push(item);
      });
    }
    //console.log(result.length);
    // 匹配完删除对应的节点
    Utils.removeMatchedDatas(nodes, result);
    // 每次匹配完后将范围缩减
    // 这里暂时只进行y范围的处理
    beginY += Math.floor(optimizeHeight / 2);

    if (beginY > maxY) {
      // 已经没节点进行匹配
      return;
    }
  }
};

// 对外接口
export default {
  pipe,
};