import QLog from '../log/qlog';
import Store from '../helper/store';
import Tree from './tree';
const Loger = QLog.getInstance(QLog.moduleData.render);
const DSLOptions: any = {};
/**
 * 将组件进行排版布局
 * @param {Array} widgetModels 进行布局的组件模型
 * @param {Array} elementModels 进行布局的元素模型
 * @returns {Object} 返回结构树
 */
const handle = function(widgetModels: any, elementModels: any) {
  if (!widgetModels && !elementModels) {
    return null;
  }
  Object.assign(DSLOptions, Store.getAll());
  const dslTree: any = new Tree(); // dsl树
  const arr = elementModels.concat(widgetModels);
  // 按面积排序
  arr.sort((a: any, b: any) => b.width * b.height - a.width * a.height);
  try {
    dslTree._setModelData(arr);
  } catch (e) {
    Loger.error(`dsl/group.ts join()
      desc: 储存记录添加的MatchData
      error:${e}`);
  }
  try {
    dslTree._addNode(arr);
  } catch (e) {
    Loger.error(`dsl/group.ts join()
      desc: 元素重组
      error:${e}`);
  }
  try {
    // 创建layers
    dslTree._rowNode();
  } catch (e) {
    Loger.error(`dsl/group.ts join()
      desc: 创建layers
      error:${e}`);
  }
  try {
    dslTree._columnNode();
  } catch (e) {
    Loger.error(`dsl/group.ts join()
      desc: 对节点进行成列排版
      error:${e}`);
  }
  return dslTree;
};
function con(a: any, b: any, aid: string, bid: string) {
  return (a.id == aid || a.id == bid) && (b.id == aid || b.id == bid);
}

export default {
  handle,
};
