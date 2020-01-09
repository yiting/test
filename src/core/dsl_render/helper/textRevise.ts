/**
 * 计算节点对齐逻辑
 */
import Constraints from '../../dsl_layout/helper/constraints';
import QLog from '../../dsl_layout/helper/qlog';
import Dictionary from '../../dsl_layout/helper/dictionary';
const Loger = QLog.getInstance(QLog.moduleData.render);
const alginMap: any = {
  Start: 'left',
  Center: 'center',
  End: 'right',
};
function textRevise(vdom: any) {
  const flexChild = vdom.children.filter(
    (n: any) =>
      n.constraints.LayoutPosition !== Constraints.LayoutPosition.Absolute,
  );
  if (flexChild.length === 1 && flexChild[0].type === Dictionary.type.QText) {
    const align =
      vdom.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal
        ? vdom.constraints.LayoutJustifyContent
        : vdom.constraints.LayoutAlignItems;
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
