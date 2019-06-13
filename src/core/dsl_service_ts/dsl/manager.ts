// 此模块用于模型的使用和管理
//
import Common from './common';
import Utils from './utils';
import ElementList from './elements/modellist';
import WidgetList from './widgets/modellist';
import Group from './group';
import Layout from './layout';

// 按优先级排序匹配模型
const sortElementList = Utils.sortModelList(ElementList);
const sortWidgetList = Utils.sortModelList(WidgetList);

/**
 * 进行节点匹配的核心流程
 * 传入节点匹配出各模型
 * @param nodes 需要匹配的节点
 * @param matchType 匹配模型的类型
 */
const matchModel = function(nodes: any, matchType: any, endY: any) {
  // 匹配的逻辑是按组件模型优先级排序,遍历组件模型数组,
  // 再按组件模型所需的元素个数通过Utils.getGroupFromNodes
  // 进行随机取出，最后交由组件模型进行匹配
  // 匹配完毕后要对元素进行去重处理
  const result: any = [];
  let modelList;

  switch (matchType) {
    case Common.MatchingElements:
      modelList = sortElementList;
      break;
    case Common.MatchingWidgets:
      modelList = sortWidgetList;
      break;
    default:
  }

  // 随机匹配节点类型算法函数
  modelList.forEach((_matchModel: any) => {
    // 获取需要匹配的节点
    let groups = [];

    if (_matchModel.getNumber() === 0) {
      // 可变节点模型的匹配
      // 获取可变节点元素模型的节点
      groups = Utils.getLineGroupFromNodes(nodes);
    } else {
      groups = Utils.getGroupFromNodes(
        nodes,
        _matchModel.getTextNumber(),
        _matchModel.getIconNumber(),
        _matchModel.getImageNumber(),
        _matchModel.getShapeNumber(),
      );
    }

    if (groups && groups.length > 0) {
      for (let i = 0; i < groups.length; i++) {
        let isMatched = false;
        const group = groups[i];

        // 这里要做一个处理，匹配完的节点就不再进行匹配
        // 以防同一节点匹配到多个组件模型，因为组件模型已有优先级
        // 所以节点等于有了优先匹配选择
        for (let j = 0; j < group.length; j++) {
          const node = group[j];

          if (node.isMatched) {
            isMatched = true;
            break;
          }
        }

        if (!isMatched) {
          const bool = _matchModel.isMatch(group);

          if (bool) {
            // 生成匹配数据
            const mData = _matchModel.getMatchData();
            if (matchType === Common.MatchingWidgets && mData.abYops > endY) {
              // 如果匹配的模型范围落在下边界里, 则模型留范围往下移动后匹配
              _matchModel.resetMatchedNodeSign();
            } else {
              result.push(mData);
              // 每个组件模型匹配完毕从总节点上移除对应的元素
              Utils.removeMatchedNodes(nodes, group);
            }
          }
        }
      }
    }
  });

  return result;
};

/**
 * 对匹配好的模型做成组处理
 * @param {Array} elementModels
 * @param {Array} widgetModels
 * @returns {DslTree} 返回组成的树
 */
const groupModel = function(elementModels: any, widgetModels: any) {
  return Group.join(elementModels, widgetModels);
};

/**
 * 对匹配好的组件/元素模型之间进行布局关系的分析处理
 * @param {DslTree} dslTree 需要进行布局关系处理的模型
 */
const layoutModel = function(dslTree: any) {
  Layout.layout(dslTree);
};

export default {
  matchModel,

  groupModel,
  layoutModel,
};
