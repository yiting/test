// 循环结构的逻辑处理模块
import Constraints from '../../helper/constraints';
import Similar from './similar';
import LayerModel from '../../../dsl_extend/models/layer/model';
import ListModel from '../../../dsl_extend/models/list/model';
import ListItemModel from '../../../dsl_extend/models/listItem/model';
// 相似节点逻辑
export function repeatRule(a: any, b: any) {
  return a.similarId && b.similarId && a.similarId === b.similarId;
}

export function repeatFilter(result: any) {
  return result
    .filter((s: any) => s.target.length > 1)
    .sort((a: any, b: any) => {
      // 先按最多重复次数，降序
      // 相同次数，按最多重复因子数， 降序
      const s = b.target.length - a.target.length;
      if (s == 0) {
        return b.feature - a.feature;
      }
      return s;
    });
}

// 相似结构处理
export function setRepeatCircle(_parent: any, _circleArr: any) {
  const circleArr: any = _circleArr;
  if (circleArr.length === 0) {
    // 如果没有相似结构，则返回
    return;
  }
  circleArr.forEach((frame: any) => {
    /**
     * 如果循环片段是一个特征的，在寻找时已经时相连的
     * */
    if (frame.feature === 1) {
      _setULCircle(_parent, frame.target);
    } else {
      /**
       * 如果循环片段是多个特征的
       */
      _setWrapBlock(_parent, frame.target);
    }
  });
}

// 设置包含结构
function _setWrapBlock(_parent: any, groups: any) {
  const inRemove: any = [];
  const similarId: any = ++Similar.similarIndex;
  groups.forEach((group: any) => {
    const newWrapData = new LayerModel({
      parent: _parent,
      similarId,
    });
    newWrapData.appendChild(...group);
    newWrapData.resize();
    newWrapData.resetZIndex();
    inRemove.push(...group);
    _parent.appendChild(newWrapData);
  });
  // 从节点中剔除被循环的节点
  _parent.children = _parent.children.filter(
    (nd: any) => !inRemove.includes(nd),
  );
}
// 设置循环结构
function _setULCircle(parent: any, target: any) {
  let { children } = parent;
  let gridChildrenLength = 0;
  children.forEach((child: any) => {
    if (
      child.constraints.LayoutSelfPosition !==
      Constraints.LayoutSelfPosition.Absolute
    ) {
      gridChildrenLength++;
    }
  });
  let inSimilar: any[] = [];
  // 获取循环节点
  target.forEach((item: any) => {
    // 提取循环节点
    inSimilar.push(...item);
  });
  // 从节点中剔除被循环的节点
  parent.children = children.filter((nd: any) => !inSimilar.includes(nd));

  let newCycleData: any;
  // 如果循环节点数与子节点数一致，替换循环节点
  if (gridChildrenLength == inSimilar.length) {
    newCycleData = parent.exchangeModel(ListModel);
  } else {
    // 构建新节点
    newCycleData = new ListModel();
    // 加入循环节点到父级元素
    parent.appendChild(newCycleData);
  }
  // 构建循环子节点
  let cycleChildren = inSimilar.map((child: any) => {
    return child.exchangeModel(ListItemModel);
  });
  // 循环层包含循环子节点
  newCycleData.appendChild(...cycleChildren);
  newCycleData.resize();
  newCycleData.resetZIndex();
}
