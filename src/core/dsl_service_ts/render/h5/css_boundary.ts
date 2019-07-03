/**
 * 边界重定义
 */
import Common from '../../dsl2/common';
import Constraints from '../../helper/constraints';
import QLog from '../../log/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);

/**
 * 边界补充
 * @param {Tree} tree
 */
function _parseBoundary(vdom: any) {
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
  if (vdom.type === Common.QBody) {
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
  if (left && right && Math.abs(left - right) < 2) {
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
  const { _abX } = vdom;
  // 最后个节点
  if (!prevNode) {
    vdom._abX = vdom.parent._abX;
  } else if (prevNode._canRightFlex()) {
    // 前节点可右拓展，取中间线
    vdom._abX = Math.floor((prevNode._abXops + vdom._abX) / 2);
  } else {
    // 其他，取末尾线
    vdom._abX = prevNode._abXops;
  }
  return Math.abs(_abX - vdom._abX);
}
// 计算右边界
function _calculateRightBoundary(vdom: any, isVertical: boolean) {
  if (!vdom._canRightFlex()) {
    return undefined;
  }
  const nextNode = isVertical ? null : vdom._nextNode();
  const { _abXops } = vdom;
  // 第一个节点
  if (!nextNode) {
    vdom._abXops =
      vdom._abXops < vdom.parent._abXops ? vdom.parent._abXops : vdom._abXops;
  } else if (nextNode._canLeftFlex()) {
    // 后节点可左拓展，取中间线
    vdom._abXops = Math.ceil((nextNode._abX + vdom._abXops) / 2);
  } else {
    // 其他，前节点尾线
    vdom._abXops = nextNode._abX;
  }
  return Math.abs(_abXops - vdom._abXops);
}

export default _parseBoundary;
