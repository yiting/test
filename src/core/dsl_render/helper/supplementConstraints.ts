/**
 * 约束计算
 */
import Constraints from '../../dsl_service_ts/helper/constraints';
import QLog from '../../dsl_service_ts/helper/qlog';
import Utils from '../../dsl_service_ts/helper/methods';
import Dictionary from '../../dsl_service_ts/helper/dictionary';
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
      `render/helper/constraints [_parseConstraints] ${e},params[vdom.id:${vdom &&
        vdom.id}]`,
    );
  }
}

// 计算六维基线
function calculateBaseLine(vdom: any) {
  let X = 0;
  let Y = 0;
  let Xops = 0;
  let Yops = 0;
  let Xctr = 0;
  let Yctr = 0;
  const pXctr = (vdom.abX + vdom.abXops) / 2;
  const pYctr = (vdom.abY + vdom.abYops) / 2;
  let nodeCount = 0;
  const errorCoefficient = 2; // 误差系数
  vdom.children.forEach((node: any) => {
    if (
      node.constraints.LayoutSelfPosition ===
      Constraints.LayoutSelfPosition.Absolute
    ) {
      // 剔除绝对定位
      return;
    }
    nodeCount += 1;
    X += Math.abs(node.abX - vdom.abX);
    Y += Math.abs(node.abY - vdom.abY);
    Xops += Math.abs(vdom.abXops - node.abXops);
    Yops += Math.abs(vdom.abYops - node.abYops);
    Xctr += Math.abs(pXctr - (node.abX + node.abXops) / 2);
    Yctr += Math.abs(pYctr - (node.abY + node.abYops) / 2);
  });
  const hStart = Math.abs(X / nodeCount) < errorCoefficient;
  const hCenter = X > Xctr && Math.abs(Xctr / nodeCount) < errorCoefficient;
  const hEnd = Xops / nodeCount === 0;
  const vStart = Math.abs(Y / nodeCount) < errorCoefficient;
  const vCenter = Y > Yctr && Math.abs(Yctr / nodeCount) < errorCoefficient;
  const vEnd = Yops / nodeCount === 0;

  const horizontalCenter = hCenter && !hStart && !hEnd;
  const horizontalEnd = hEnd && !hStart;
  const horizontalStart = !horizontalCenter && !horizontalEnd;
  // const verticalCenter = vCenter && !vStart && !vEnd;
  const verticalCenter = vCenter;
  // const verticalEnd = vEnd && !vStart;
  const verticalEnd = vEnd && !vCenter && !vStart;
  const verticalStart = !verticalCenter && !verticalEnd;

  return {
    horizontalStart,
    horizontalCenter,
    horizontalEnd,
    verticalStart,
    verticalCenter,
    verticalEnd,
  };
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
    vdom.type == Dictionary.type.QBody ||
    (!canNewLine && children.length > 0 && Utils.isVertical(children));
  // 计算基线
  const baseLine: any = calculateBaseLine(vdom);
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
  // 修正为水平左对齐
  if (
    vdom.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal &&
    vdom.constraints.LayoutJustifyContent ===
      Constraints.LayoutJustifyContent.End
  ) {
    vdom.constraints.LayoutJustifyContent =
      Constraints.LayoutJustifyContent.Start;
  }
  if (
    // 修正为水平顶对齐
    vdom.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal &&
    vdom.constraints.LayoutAlignItems === Constraints.LayoutAlignItems.End
  ) {
    vdom.constraints.LayoutAlignItems = Constraints.LayoutAlignItems.Start;
  }
  if (
    // 修正为垂直左对齐
    vdom.constraints.LayoutDirection === Constraints.LayoutDirection.Vertical &&
    vdom.constraints.LayoutAlignItems === Constraints.LayoutAlignItems.End
  ) {
    vdom.constraints.LayoutAlignItems = Constraints.LayoutAlignItems.Start;
  }
  if (
    // 修正为垂直顶对齐
    vdom.constraints.LayoutDirection === Constraints.LayoutDirection.Vertical &&
    vdom.constraints.LayoutJustifyContent ===
      Constraints.LayoutJustifyContent.End
  ) {
    vdom.constraints.LayoutJustifyContent =
      Constraints.LayoutJustifyContent.Start;
  }
}

export default _supplementConstraints;
