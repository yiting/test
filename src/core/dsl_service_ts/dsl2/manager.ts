// 此模块用于模型的使用和管理
//
import Common from './common';
import Utils from './utils';
import Store from '../helper/store';
import H5ModelList from './modellist/h5';
import ArkModelList from './modellist/ark';
const modelListMap: any = {
  h5: H5ModelList,
  ark: ArkModelList,
};
/**
 * 进行节点匹配的核心流程
 * 传入节点匹配出各模型
 * @param nodes 需要匹配的节点
 * @param matchType 匹配模型的类型
 * @param endY 范围匹配的下边界,用于辅助匹配
 */
let matchModel = function(nodes: any[], matchType: any, endY: number): any {
  // 匹配的逻辑是按组件模型优先级排序,遍历组件模型数组,
  // 再按组件模型所需的元素个数通过Utils.getGroupFromNodes
  // 进行随机取出，最后交由组件模型进行匹配
  // 匹配完毕后要对元素进行去重处理
  let result: any[] = [];
  const outputType = Store.get('outputType');
  const model: any = modelListMap[outputType];
  let modelList: any;

  //console.log('while循环匹配前节点长度: ' + nodes.length);
  // 按优先级排序匹配模型列表,(1.模型排序计算已测)
  switch (matchType) {
    case Common.MatchingElements:
      modelList = Utils.sortModelList(model.base.concat(model.elements));
      break;
    case Common.MatchingWidgets:
      modelList = Utils.sortModelList(model.widgets);
      break;
    case Common.MatchingBase:
      modelList = model.base; // 基础元素则不用排序优先级了;
      break;
    default:
  }

  modelList.forEach((model: any) => {
    let groups: any[] = []; // 需要匹配的节点

    groups = Utils.getGroupFromNodes(
      nodes,
      model.getTextNumber(),
      model.getIconNumber(),
      model.getImageNumber(),
      model.getShapeNumber(),
    );
    //console.log(groups);
    if (groups && groups.length > 0) {
      for (let i = 0; i < groups.length; i++) {
        let isMatched: boolean = false;
        let group: any[] = groups[i];

        // 这里要做一个处理，匹配完的节点就不再进行匹配
        // 以防同一节点匹配到多个组件模型，因为组件模型已有优先级
        // 所以节点等于有了优先匹配选择
        for (let j = 0; j < group.length; j++) {
          let node: any = group[j];

          if (node.isMatched) {
            isMatched = true;
            break;
          }
        }

        if (!isMatched) {
          let bool: boolean = model.isMatch(group);

          if (bool) {
            // 获取匹配
            let mData: any = model.getMatchData();
            //console.log(mData);
            // 这里改为对所有模型都适用落在下边界则不匹配,留待下轮的原则
            // matchType === Common.MatchingWidgets && mData.abYops >= endY
            if (matchType != Common.MatchingBase && mData.abYops >= endY) {
              // 如果匹配的模型范围落在下边界里, 则模型留范围往下移动后匹配
              model.resetMatchedNodeSign();
              //console.log('------------ 落在边界的模型 ---------------');
            } else {
              result.push(mData);
              // 每个模型匹配完毕从总节点上移除对应的元素
              Utils.removeMatchedNodes(nodes, group);
            }
          }
        }
      }
    }
  });
  //console.log('while循环匹配后节点长度: ' + nodes.length);
  return result;
};

/**
 * 把节点转为基础模型
 * @param nodes 要匹配的节点
 * @param matchedElements 匹配了的元素模型增加到数组
 */
let matchElementBase = function(nodes: any[], matchedElements: any[]): void {
  if (!nodes || nodes.length === 0) {
    return;
  }

  let result: any[] = matchModel(nodes, Common.MatchingBase, 0);
  if (result.length > 0) {
    result.forEach((model: any) => {
      matchedElements.push(model);
    });
  }
};

/**
 * 将元素模型变成可变节点元素模型
 * @param elements Array<ElementModel> 要匹配的元素模型
 * @param endY 范围匹配的下边界,用于辅助匹配
 */
let matchElementX = function(elements: any[], endY: number): any {
  // 可变节点模型的匹配用于匹配特殊设计形态的设计,就是节点是可增可减,
  // 所以这里的逻辑直接交回模型本身去处理,而不再像常规匹配那样获取匹配的节点组合给模型处理
  let result: any[] = [];
  const outputType = Store.get('outputType');
  const model: any = modelListMap[outputType];
  const sortElementXList: any[] = model.emx; // 可变节点元素模型列表

  sortElementXList.forEach((model: any) => {
    let bool = model.isMatch(elements);

    if (bool) {
      let mDatas: any[] = model.getMatchData();

      if (mDatas.length > 0) {
        mDatas.forEach((mData: any) => {
          // 加入到result并移除节点
          result.push(mData);

          let nodes = mData.getMatchNode(); // 可变节点元素里拿出来的也是MatchData
          Utils.removeMatchedNodes(elements, nodes);
        });
      }
    }
  });

  return result;
};

export default {
  matchModel,
  matchElementBase,
  matchElementX,
};
