import Utils from '../layout/utils';
import Constraints from '../helper/constraints';
import Dictionary from '../helper/dictionary';
import Model from '../model/model';
import Dividing from '../model/modelList/dividing';
import Store from '../helper/store';
import { debug } from 'util';

// 创建layer时的自增id
let LayerId = 0;

const DSLOptions: any = {};

/**
 * 添加元素节点
 */
function handle(arr: any) {
  // 找到跟节点
  const body = arr.find((node: any) => node.type == Dictionary.type.QLayer);
  // 排序分组
  const segmentings = sortSegmentings(arr);
  // 组合
  organize(segmentings, body);
  return body;
}
function sortSegmentings(arr: any) {
  // 按面积排序
  arr.sort((a: any, b: any) => b.width * b.height - a.width * a.height);
  const group: any = [];
  arr.forEach((node: any) => {
    if (!group[node.zIndex]) {
      group[node.zIndex] = [];
    }
    group[node.zIndex].push(node);
  });
  const segmentings: any = [];
  group.forEach((list: any) => {
    segmentings.push(...list);
  });
  return segmentings;
}
function organize(segmentings: any[], body: Model) {
  const compareArr = [body];
  // 递进
  segmentings.forEach((child: any, i: any) => {
    if (child && child.type !== Dictionary.type.QLayer) {
      const done = compareArr.some(parent => {
        if (
          parent.id ==
            '_E62AB5A9-3A26-44A4-B944-F245E28D371A_26751E80-C058-4798-80B6-464440A92C7B_8B8F53C4-CE77-4D4A-AEC1-9F21FFDF5923' &&
          child.id == '9084FF6D-1D9E-4E0D-AD9D-47C885DF2A45'
        )
          debugger;
        const _utils = Utils;
        if (
          // 父节点必须不是文本类型
          parent.type === Dictionary.type.QText ||
          // 子节点不能分割线
          // child instanceof Dividing ||
          // 子节点必须关联
          !_utils.isConnect(
            child,
            parent,
            -1,
          ) /* ||
                        // 子节点比父节点更靠下
                        (child.zIndex > parent.zIndex &&
                        child.abY > parent.abY &&
                        child.abYops > parent.abYops) */
        ) {
          return false;
        }
        if (
          child.zIndex >= parent.zIndex &&
          // 包含关系
          (_utils.isWrap(parent, child) ||
            // 水平相连、垂直包含关系
            (parent.abYops >= child.abYops && parent.abY <= child.abYops))
        ) {
          const node = _add(child, parent, false);
          compareArr.unshift(node);
          segmentings[i] = null;
          return true;
        }
        // 其他情况都为绝对定位
        const node = _add(child, parent, true);
        compareArr.unshift(node);
        segmentings[i] = null;
        return true;
      });
      if (!done) {
        const node = _add(child, body, false);
        compareArr.unshift(node);
        segmentings[i] = null;
      }
    }
  });
}
function _isAbsoluteRelation(node: any, parent: any) {
  /**
   * 如果子节点在父节点的角点上，切高宽为一定比例，则认为是父节点外的绝对定位
   * */
  // const leftTop = node.abX <= parent.abX && node.abY <= parent.abY;
  // const rightTop = node.abXops >= parent.abXops && node.abY <= parent.abY;
  // const leftBottom = node.abX <= parent.abX && node.abYops >= parent.abYops;
  // const rightBottom =
  //   node.abXops >= parent.abXops && node.abYops >= parent.abYops;
  const left = node.abX <= parent.abX && node.abX > 0;
  const right =
    node.abXops >= parent.abXops && node.abXops < DSLOptions.designWidth;
  const bottom = node.abYops >= parent.abYops;
  const top = node.abY <= parent.abY;
  const rate = 2;
  const rateX = (parent.abXops - parent.abX) / (node.abXops - node.abX) > rate;
  const rateY =
    node.abYops - node.abY <= 28 * 2 &&
    (parent.abYops - parent.abY) / (node.abYops - node.abY) > rate;
  return (left || right || top || bottom) && rateX && rateY;
}
/**
 * 往父节点添加子节点
 * @param {MatchData} child 子节点
 * @param {MatchData} parent 父节点
 */
function _add(_child: any, _parent: any, _isAbsolute: Boolean) {
  // node为RenderData
  let parent: any = _parent;
  let child: any = _child;
  if (!_isAbsolute && _isAbsoluteRelation(child, parent)) {
    parent = parent.parent || parent;
    parent.constraints.LayoutPosition = Constraints.LayoutPosition.Absolute;
    child.constraints.LayoutSelfPosition =
      Constraints.LayoutSelfPosition.Absolute;
  }

  if (_isAbsolute) {
    child.constraints.LayoutSelfPosition =
      Constraints.LayoutSelfPosition.Absolute;
  }
  child.parent = parent;
  parent.children = parent.children.concat(child);
  /**
   * 如果父节点为QImage时，添加子节点后，父节点模型类型改为layer，
   * 让父节点取代使用QImage模板
   * */
  if (parent.type === Dictionary.type.QImage) {
    parent.type = Dictionary.type.QLayer;
  }
  return child;
}

export default handle;
