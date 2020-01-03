// 循环结构的逻辑处理模块
import Constraints from '../../helper/constraints';
import Similar from './similar';
import Store from '../../helper/store';
import ListModel from '../../../dsl_model/models/list/model';
import ListItemModel from '../../../dsl_model/models/listItem/model';
import LayerModel from '../../../dsl_model/models/layer/model';
let ErrorCoefficient: number = 0;

export function breakRule(a: any, b: any) {
  return a.similarId && b.similarId && a.similarId === b.similarId;
}
export function breakFilter(result: any) {
  return result
    .filter((s: any) => s.target.length > 0)
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
// 打破循环的特征规则
export function breakFeature(feature: any) {
  // 特征数大于2
  ErrorCoefficient = Store.get('errorCoefficient') || 0;
  // 子节点排序
  if (feature.length < 2) {
    return false;
  }
  return feature.every((node: any, index: number) => {
    // const child: any = node.children[0];
    if (
      // 剔除绝对定位元素，绝对定位元素不参与判断
      node.constraints['LayoutSelfPosition'] ==
        Constraints.LayoutSelfPosition.Absolute ||
      // 是循环节点
      node.constructor !== ListModel
    ) {
      return false;
    }
    if (index === 0) {
      return true;
    }
    // 子循环节点的循环数量一致
    let prev: any = feature[index - 1];
    let curListItem = getListItem(node.children);
    let prevListItem = getListItem(prev.children);

    if (curListItem.length !== prevListItem.length) {
      return false;
    }
    // 子循环节点的循环位置相同
    return curListItem.every((child: any, index: number) => {
      let l: any = curListItem[index];
      let n: any = prevListItem[index];
      return (
        Math.abs(l.abX - n.abX) < ErrorCoefficient ||
        Math.abs(l.abY - n.abY) < ErrorCoefficient ||
        // 末节点对齐
        Math.abs(l.abXops - n.abXops) < ErrorCoefficient ||
        Math.abs(l.abYops - n.abYops) < ErrorCoefficient ||
        //中线对齐
        Math.abs(l.abX + l.abXops - n.abX - n.abXops) < ErrorCoefficient ||
        Math.abs(l.abY + l.abYops - n.abY - n.abYops) < ErrorCoefficient
      );
    });
  });
}
// 设置内循环处理
export function setBreakCircle(_parent: any, _circleArr: any) {
  _circleArr.forEach((fragment: any) => {
    let rowSimilarIndex: number = ++Similar.similarIndex;
    fragment.target.forEach((group: any) => {
      // 父节点剔除当前循环节点
      _parent.children = _parent.children.filter(
        (child: any) => !group.includes(child),
      );
      let newCycleData = new ListModel({
        similarId: rowSimilarIndex,
      });
      _parent.appendChild(newCycleData);
      let otherChildren: any = [];
      let newChildren: any = [];
      let _catchCols: any = [];
      let childrenLastIndex = 0;
      group.forEach((list: any) => {
        childrenLastIndex = 0;
        list.children.forEach((child: any) => {
          if (child.constructor !== ListItemModel) {
            otherChildren.push(child);
            return;
          }
          // 转化循环节点为布局子节点
          let layerChild = child.exchangeModel(LayerModel);
          if (!_catchCols[childrenLastIndex]) {
            _catchCols[childrenLastIndex] = [];
          }
          _catchCols[childrenLastIndex].push(layerChild);
          childrenLastIndex += 1;
        });
      });
      // 创建新循环子节点
      _catchCols.forEach((children: any) => {
        let itemSimilarId = children
          .map((nd: any) => nd.similarId || '@')
          .join('_');
        let newListItem = new ListItemModel({
          similarId: itemSimilarId,
          constraints: {
            LayoutFixedWidth: Constraints.LayoutFixedWidth.Fixed,
          },
        });
        newChildren.push(newListItem);
        newListItem.appendChild(...children);
        newListItem.resize();
      });
      newCycleData.appendChild(...newChildren);
      newCycleData.appendChild(...otherChildren);
      newCycleData.resize();
      newCycleData.resetZIndex();
    });
  });
}
let getListItem = (children: any[]) => {
  return children.filter((child: any) => child.constructor === ListItemModel);
};
