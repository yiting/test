/**
 * 约束计算
 */
import Constraints from '../../helper/constraints';
import QLog from '../../log/qlog';
import Common from '../../dsl2/common';
const Loger = QLog.getInstance(QLog.moduleData.render);
const alginMap: any = {
  Start: 'left',
  Center: 'center',
  End: 'right',
};
function textRevise(vdom: any) {
  const flexChild = vdom.children.filter(
    (n: any) =>
      n.constraints.LayoutSelfPosition !==
      Constraints.LayoutSelfPosition.Absolute,
  );
  if (flexChild.length === 1 && flexChild[0].type === Common.QText) {
    const align =
      vdom.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal
        ? vdom.constraints.LayoutJustifyContent
        : vdom.constraints.LayoutAlignItems;
    console.log(flexChild[0].id, align);
    vdom.styles.textAlign = alginMap[align];
  }
}

function handle(vdom: any) {
  try {
    vdom.children.forEach((cn: any) => {
      handle(cn);
    });
    textRevise(vdom);
  } catch (e) {
    Loger.error(
      `render/helper/textRevise.js [handle] ${e},params[vdom.id:${vdom &&
        vdom.id}]`,
    );
  }
}
export default handle;
