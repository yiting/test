// dsl模块
//
// dsl的核心思路:
// 所有网页设计由基础元素: 文字(QText), 较大图片(QImage), 120*120以下图片(QIcon), 可样式描述层(QShape)组成
// 基础元素的互相组合形成了页面设计的组件, 但由于设计稿层级和结构的不可靠性, 导致节点的不可靠性, 但网页
// 设计的组件的确由这些组件所组成, 也就是说这些节点的确能组成我们所需的组件。所以可以排列尽这些节点所能
// 形成的组合, 然后根据组件模型去判断那个组合是合理的, 然后将这些组合全部找出来, 最后对这些组合进行排版及循环处理
import Common from './common';
import Config from './config';
import Utils from './utils';
import Manager from './manager';
import Model from './model';

import Store from '../helper/store';

import QLog from '../log/qlog';
import { Logger } from 'log4js';

const Loger = QLog.getInstance(QLog.moduleData.render);
/**
 * 返回dsl生成的配置
 * @return {Json}
 */
const config = function() {
  return Config.create();
};

/**
 * 通过Json计算出Symbol的唯一标识
 * @param {Json} json
 */
const getSymbolIdentity = function(json: any) {
  return Model.jsonToMD5(json, []);
};

/**
 * 函数用于匹配增加的自定义组件
 */
const _matchSymbols = function(widgets: any) {
  return widgets;
};

/**
 * 对匹配好的模型做成组处理
 * @param {Array} widgets 已匹配的组件模型
 * @param {Array} elements 已匹配的元素模型
 * @returns {DslTree}
 */
const _groupModels = function(widgets: any[], elements: any[]) {
  const tree: any = Manager.groupModel(widgets, elements);
  return tree;
};

/**
 * 对DSL树对象进行布局及循环处理
 * @param {DslTree} dslTree DslTree对象
 * @param {Int} layoutType 布局的方式
 */
const _layoutModels = function(dslTree: any, layoutType: any) {
  Manager.layoutModel(dslTree);
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
const _matchModels = function(
  matchTimes: number,
  matchedNodes: any[],
  nodes: any[],
  mType: any,
  optimizeWidth: any,
  optimizeHeight: number,
  maxX: number,
  maxY: number,
) {
  if (!nodes || !nodes.length || nodes.length === 0 || matchTimes <= 0) {
    return;
  }
  const beginX = 0;
  let beginY = 0;
  let nowTimes = 0;
  while (nowTimes < matchTimes) {
    nowTimes += 1;
    if (nowTimes >= matchTimes) {
      console.log('重要: 节点匹配计算量超过matchTimes上限!');
    }

    // 需要匹配的节点
    const mNodes = Utils.getNodesFromSize(
      nodes,
      beginX,
      beginY,
      optimizeWidth,
      optimizeHeight,
    );
    // console.log('Utils.getNodesFromSize 得到需要处理的节点长度为: ' + mNodes.length);
    // 通过模型匹配出各组件
    let result;
    if (mNodes && mNodes.length > 0) {
      result = Manager.matchModel(mNodes, mType, beginY + optimizeHeight);
    }

    if (result && result.length > 0) {
      result.forEach((item: any) => {
        matchedNodes.push(item);
      });
    }

    // 匹配完删除对应的节点
    Utils.removeMatchedDatas(nodes, result);
    // 每次匹配完后将范围缩减
    // 这里暂时只进行y范围的处理
    beginY += Math.floor(optimizeHeight / 2);

    if (beginY >= maxY) {
      // 已经没节点进行匹配
      return;
    }
  }
};
/**
 * dsl模块的使用接口
 * @param {Array} nodes 要匹配的所有节点
 * @param {Int} layoutType dsl的布局方式
 */
const pipe = function(nodes: any) {
  let dslTree: any; // 最后生成的dsl数据结构树
  if (!nodes || !nodes.length || nodes.length === 0) {
    return dslTree;
  }
  // 生成一些配置用参数
  Common.DesignWidth = nodes[0].width;
  Common.DesignHeight = nodes[0].height;

  let maxNodeX = 0; // 用于将空间分割的辅助参数
  let maxNodeY = 0; // 用于将空间分割的辅助参数
  const matchingNodes: any[] = []; // 需要进行匹配的节点
  const matchedElements: any[] = []; // 匹配完毕的元素模型
  const matchedWidgets: any[] = []; // 匹配完毕的组件模型
  const matchedSymbols: any[] = []; // 匹配完毕的自定义组件
  const optimizeWidth = Store.get('optimizeWidth') * 2; // 这里*2是增加获取数据的范围, 防止超出设计稿外的元素没被匹配
  const optimizeHeight = Store.get('optimizeHeight');
  const layoutType = Store.get('layoutType');

  try {
    // 给匹配的节点做分类成四个基本节点类型,(QText, QIcon, QImage, QShape)
    nodes.forEach((_item: any, _index: any) => {
      const item: any = _item;
      const index: any = _index;
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
          console.log(`nodes分类遇到没有对应类型的节点,id:${item.id}`);
      }
    });
  } catch (e) {
    Loger.error(`dsl/dsl.ts pipe() error:${e}`);
  }
  // 自定义组件模型库的匹配
  _matchSymbols(matchedSymbols);
  try {
    // 匹配元素模型
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
    Loger.error(`dsl/dsl.ts pipe()
      desc:匹配元素
      error:${e}`);
  }
  try {
    // 匹配组件模型
    _matchModels(
      10000,
      matchedWidgets,
      matchedElements,
      Common.MatchingWidgets,
      optimizeWidth,
      optimizeHeight,
      maxNodeX,
      maxNodeY,
    );
    // Utils.logWidgetInfo(matchedElements);
    // Utils.logWidgetInfo(matchedWidgets);
  } catch (e) {
    Loger.error(`dsl/dsl.ts pipe()
      desc: 匹配组件
     error:${e}`);
  }
  try {
    // 生成dsl树
    dslTree = _groupModels(matchedWidgets, matchedElements);
  } catch (e) {
    Loger.error(`dsl/dsl.ts pipe()
      desc: 生成dsl树
     error:${e}`);
  }
  try {
    // 进行布局及循环处理
    _layoutModels(dslTree, layoutType);
  } catch (e) {
    Loger.error(`dsl/dsl.ts pipe()
      desc: 布局处理
     error:${e}`);
  }
  return dslTree;
};
// 对外接口
export default {
  pipe,
  getSymbolIdentity,
  config,
};
