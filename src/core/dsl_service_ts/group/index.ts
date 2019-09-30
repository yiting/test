import QLog from '../log/qlog';
import Store from '../helper/store';
import TreeProcess from './tree';
import GridProcess from './grid';
const Loger = QLog.getInstance(QLog.moduleData.render);
const DSLOptions: any = {};
/**
 * 将组件进行排版布局
 * @param {Array} widgetModels 进行布局的组件模型
 * @param {Array} elementModels 进行布局的元素模型
 * @returns {Object} 返回结构树
 */

export default function(models: any[]) {
  if (!models) {
    return null;
  }
  Object.assign(DSLOptions, Store.getAll());
  let processDesc;
  try {
    const orgTree: any = TreeProcess(models); // dsl树
    processDesc = '元素重组';
    const gridTree = GridProcess(orgTree);
    return gridTree;
  } catch (e) {
    Loger.error(`process:dsl/group.ts
    desc: ${processDesc}
    error:${e}`);
  }
}
function con(a: any, b: any, aid: string, bid: string) {
  return (a.id == aid || a.id == bid) && (b.id == aid || b.id == bid);
}
