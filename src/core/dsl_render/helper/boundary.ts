/**
 * 边界重定义
 */
import Dictionary from '../../dsl_layout/helper/dictionary';
import Constraints from '../../dsl_layout/helper/constraints';
import QLog from '../../dsl_layout/helper/qlog';
import Store from '../../dsl_layout/helper/store';
import { debug } from 'util';
let ErrorCoefficient: number = 0;

const Loger = QLog.getInstance(QLog.moduleData.render);

/**
 * 边界补充
 * @param {Tree} tree
 */
function _parseBoundary(vdom: any) {
  ErrorCoefficient = Store.get('errorCoefficient') || 0;
  try {
    _calculateBoundary(vdom);
    vdom.children.forEach((cn: any) => {
      _parseBoundary(cn);
    });
  } catch (e) {
    Loger.error(
      `css_boundary.js [_parseBoundary] ${e},params[vdom.id:${vdom &&
        vdom.id}]`,
    );
  }
}
/**
 * 边界重定义
 */
function _calculateBoundary(vdom: any) {
  // 跟节点不调整
  if (vdom.type === Dictionary.type.QBody) {
    return;
  }
  if (vdom._isAbsolute()) {
    return;
  }
  // 如果是多行
  // if (vdom.constraints.LayoutWrap === Constraints.LayoutWrap.Wrap) {
  // }
  const isVertical = vdom._isParentVertical();
  const left = _calculateLeftBoundary(vdom, isVertical);
  const right = _calculateRightBoundary(vdom, isVertical);
  _calculateBoundaryConstraints(vdom, isVertical, left, right);
}

// 计算边界变更后的约束
function _calculateBoundaryConstraints(
  vdom: any,
  isVertical: boolean,
  left: any,
  right: any,
) {
  if (left && right && Math.abs(left - right) <= ErrorCoefficient) {
    if (isVertical) {
      vdom.constraints.LayoutAlignItems = Constraints.LayoutAlignItems.Center;
    } else {
      vdom.constraints.LayoutJustifyContent =
        Constraints.LayoutJustifyContent.Center;
    }
  }
}
// 计算左边界
function _calculateLeftBoundary(vdom: any, isVertical: boolean) {
  if (!vdom._canLeftFlex()) {
    return undefined;
  }
  const prevNode = isVertical ? null : vdom._prevNode();
  const prevLine = vdom._prevLine();
  const { abX } = vdom;
  // 第一个节点
  if (!prevNode || prevLine.includes(prevNode)) {
    vdom.abX = vdom.abX > vdom.parent.abX ? vdom.parent.abX : vdom.abX;
  } else if (prevNode._canRightFlex()) {
    // 前节点可右拓展，取中间线
    vdom.abX = Math.floor((prevNode.abXops + vdom.abX) / 2);
  } else {
    // 其他，取末尾线
    vdom.abX = prevNode.abXops;
  }
  return Math.abs(abX - vdom.abX);
}
// 计算右边界
function _calculateRightBoundary(vdom: any, isVertical: boolean) {
  if (!vdom._canRightFlex()) {
    return undefined;
  }
  const nextNode = isVertical ? null : vdom._nextNode();
  const nextLine = vdom._nextLine();
  const { abXops } = vdom;
  // 最后个节点
  if (!nextNode || nextLine.includes(nextNode)) {
    vdom.abXops =
      vdom.abXops < vdom.parent.abXops ? vdom.parent.abXops : vdom.abXops;
  } else if (nextNode._canLeftFlex()) {
    // 后节点可左拓展，取中间线
    vdom.abXops = Math.ceil((nextNode.abX + vdom.abXops) / 2);
  } else {
    // 其他，前节点尾线
    vdom.abXops = nextNode.abX;
  }
  return Math.abs(abXops - vdom.abXops);
}

export default _calculateBoundary;
