/**
 * 边界重定义
 */
import Common from '../../dsl/common';
import Constraints from '../../dsl/constraints';
import QLog from '../../log/qlog';
import Utils from '../utils';
const Loger = QLog.getInstance(QLog.moduleData.render);

/**
 * 约束补充
 * @param {Tree} vdom
 */
function _parseConstraints(vdom: any) {
  try {
    vdom.children.forEach((cn: any) => {
      _parseConstraints(cn);
    });
    _supplementConstraints(vdom);
  } catch (e) {
    Loger.error(
      `css_dom.js [_parseConstraints] ${e},params[vdom.id:${vdom && vdom.id}]`,
    );
  }
}

// 约束补充计算
function _supplementConstraints(vdom: any) {
  const { children } = vdom;
  if (children.length === 0) {
    return;
  }
  // 能否换行
  const canNewLine =
    vdom.constraints.LayoutWrap === Constraints.LayoutWrap.Wrap;
  // 是否垂直布局
  const isVertical =
    !canNewLine && children.length > 0 && Utils.isVertical(children);
  // 计算基线
  const baseLine: any = Utils.calculateBaseLine(vdom);
  const _justifyContent = isVertical ? 'vertical' : 'horizontal';
  const _alignItems = isVertical ? 'horizontal' : 'vertical';
  // 约束方向判断
  vdom.constraints.LayoutDirection =
    vdom.constraints.LayoutDirection ||
    (isVertical
      ? Constraints.LayoutDirection.Vertical
      : Constraints.LayoutDirection.Horizontal);
  // 主轴约束补充
  vdom.constraints.LayoutJustifyContent =
    vdom.constraints.LayoutJustifyContent ||
    (baseLine[`${_justifyContent}Center`] &&
      Constraints.LayoutJustifyContent.Center) ||
    (baseLine[`${_justifyContent}End`] &&
      Constraints.LayoutJustifyContent.End) ||
    (baseLine[`${_justifyContent}Start`] &&
      Constraints.LayoutJustifyContent.Start);
  // 副轴约束补充
  vdom.constraints.LayoutAlignItems =
    vdom.constraints.LayoutAlignItems ||
    (baseLine[`${_alignItems}Center`] &&
      Constraints.LayoutJustifyContent.Center) ||
    (baseLine[`${_alignItems}End`] && Constraints.LayoutJustifyContent.End) ||
    (baseLine[`${_alignItems}Start`] && Constraints.LayoutJustifyContent.Start);

  /**
   * H5约束修正：
   */
  if (
    vdom.constraints.LayoutDirection === Constraints.LayoutDirection.Vertical &&
    vdom.constraints.LayoutAlignItems === Constraints.LayoutAlignItems.End
  ) {
    vdom.constraints.LayoutAlignItems = Constraints.LayoutAlignItems.Start;
  }
  if (
    vdom.constraints.LayoutDirection === Constraints.LayoutDirection.Vertical
  ) {
    vdom.constraints.LayoutJustifyContent =
      Constraints.LayoutJustifyContent.Start;
  }
}

export default _parseConstraints;
