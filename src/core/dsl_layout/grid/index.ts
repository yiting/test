import QLog from '../../dsl_helper/qlog';
import Store from '../../dsl_helper/store';
import GridProcess from './grid';
const Loger = QLog.getInstance(QLog.moduleData.render);
const DSLOptions: any = {};
/**
 * 将组件进行排版布局
 * @param {Array} widgetModels 进行布局的组件模型
 * @param {Array} elementModels 进行布局的元素模型
 * @returns {Object} 返回结构树
 */

export default function(tree: any) {
  if (!tree) {
    return null;
  }
  Object.assign(DSLOptions, Store.getAll());
  let processDesc;
  try {
    processDesc = '元素栅格化';
    GridProcess(tree);
    return tree;
  } catch (e) {
    Loger.error(`process:grid/index.ts
    desc: ${processDesc}
    error:${e}`);
  }
}
function con(a: any, b: any, aid: string, bid: string) {
  return (a.id == aid || a.id == bid) && (b.id == aid || b.id == bid);
}
