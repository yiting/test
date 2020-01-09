import Utils from '../helper/methods';
import Constraints from '../helper/constraints';
import Dictionary from '../helper/dictionary';
import Model from '../model/model';
import LayerModel from '../../dsl_model/models/layer';
import BodyModel from '../../dsl_model/models/layer';
import Dividing from '../../dsl_render/h5/models/dividing/model';

const DSLOptions: any = {};

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
    if (!child || child.type === Dictionary.type.QBody) {
      return;
    }
    let done = compareArr.some((parent: any, index: number) => {
      if (!parent) {
        return false;
      }

      let node;
      // 如果父节点包含干涉元素，则只有干涉元素能作为子节点
      if (
        (parent._allowed_descendantIds &&
          !parent._allowed_descendantIds.includes(child.id)) ||
        // 父节点必须不是文本类型
        parent.type === Dictionary.type.QText ||
        // 父节点不能是分割线
        parent instanceof Dividing ||
        // 子节点不能分割线
        // child instanceof Dividing ||
        // 分层次
        (child.zIndex > parent.zIndex &&
          child.abY > parent.abY &&
          child.abYops > parent.abYops) ||
        // 子节点必须关联
        !Utils.isConnect(
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
      } else {
        if (
          child.zIndex >= parent.zIndex &&
          // 包含关系
          (Utils.isWrap(parent, child) ||
            // 水平相连、垂直包含关系
            (parent.abYops >= child.abYops && parent.abY <= child.abYops))
        ) {
          node = _add(child, parent, false);
        } else {
          // 其他情况都为绝对定位
          node = _add(child, parent, true);
        }
      }
      compareArr.unshift(node);
      segmentings[i] = null;
      return true;
    });
    if (!done) {
      const node = _add(child, body, false);
      compareArr.unshift(node);
      segmentings[i] = null;
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
  /*  if (!_isAbsolute && _isAbsoluteRelation(child, parent)) {
       parent = parent.parent || parent;
       parent.constraints.LayoutPosition = Constraints.LayoutPosition.Absolute;
       child.constraints.LayoutPosition =
         Constraints.LayoutPosition.Absolute;
     } */

  if (_isAbsolute) {
    child.constraints.LayoutPosition = Constraints.LayoutPosition.Absolute;
  }
  child.parent = parent;
  parent.children.push(child);
  /**
   * 如果父节点为QImage时，添加子节点后，父节点模型类型改为layer，
   * 让父节点取代使用QImage模板
   * */
  if (parent.type === Dictionary.type.QImage) {
    // parent.type = Dictionary.type.QLayer;
    let mod = parent.parent ? LayerModel : BodyModel;
    parent.exchangeModel(mod);
  }
  return child;
}

export default function(arr: any) {
  // 找到跟节点
  let body = arr.find((node: any) => node.type == Dictionary.type.QBody);

  // 排序分组
  const segmentings = sortSegmentings(arr);
  // 组合
  organize(segmentings, body);
  return body;
}
