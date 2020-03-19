// 循环结构的逻辑处理模块
import * as Constraints from '../../../dsl_helper/constraints';
import ListModel from '../../../dsl_render/h5/models/list/model';

export function repeatLogic(a: any, b: any) {
  return false;
}
export function featureLogic(feature: any) {
  let childSimilarId: any = null;
  return (
    feature.length > 1 &&
    feature.every((n: any, i: number) => {
      let isSame =
        n.constructor === ListModel &&
        n.children.length > 0 &&
        n.children[0].similarId &&
        (childSimilarId === null || childSimilarId === n.children[0].similarId);
      childSimilarId = n.children[0] ? n.children[0].similarId : null;
      return isSame;
    })
  );
}
export function filterLogic(result: any) {
  return result.sort((a: any, b: any) => {
    // 先按最多重复次数，降序
    return b.feature - a.feature;
  });
}

// 系列循环
export function setSerialCircle(_parent: any, circleArr: any) {
  circleArr.forEach((frame: any) => {
    frame.target.forEach((list: any) => {
      _setWrapCircle(_parent, list);
    });
  });
}
// 设置换行循环结构
function _setWrapCircle(_parent: any, listGroup: any) {
  let listItemGroup: any = [];
  listGroup.forEach((list: any) => {
    listItemGroup.push(...list.children);
  });
  // 合并循环节点为新节点
  let newCycleParent = new ListModel();
  newCycleParent.appendChild(...listItemGroup);
  newCycleParent.resize();
  newCycleParent.resetZIndex();
  newCycleParent.constraints['LayoutWrap'] = Constraints.LayoutWrap.Wrap;
  newCycleParent.constraints['LayoutFixedWidth'] =
    Constraints.LayoutFixedWidth.Fixed;

  const gap = Math.max(
    ...listItemGroup.map((cur: any, i: number) => {
      if (i == 0) {
        return -Infinity;
      }
      const prve = listItemGroup[i - 1];
      return cur.abX - prve.abXops;
    }),
  );
  newCycleParent.abX = newCycleParent.abX - gap;
  _parent.children = _parent.children.filter(
    (node: any) => !listGroup.includes(node),
  );
  _parent.appendChild(newCycleParent);
}
