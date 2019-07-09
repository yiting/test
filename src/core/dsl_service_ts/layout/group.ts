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
function clean(arr: any[]) {
  arr.forEach((node: any) => {
    if (node.data.text && node.data.text[node.data.text.length - 1] == '\n') {
      const text = node.data.text.slice(0, -1);
      const abYops = node.abYops - node.data.styles.lineHeight;
      const height = abYops - node.abY;
      node.data.set('text', text);
      node.data.set('abYops', abYops);
      node.data.set('height', height);
      node.abYops = abYops;
      node.height = height;
    }
  });
}

const handle = function(models: any[], bodyModel: any) {
  if (!models) {
    return null;
  }
  Object.assign(DSLOptions, Store.getAll());
  const dslTree: any = new Tree(bodyModel); // dsl树
  try {
    clean(models);
  } catch (e) {
    Loger.error(`dsl/group.ts clean()
      desc: 数据清洗
      error:${e}`);
  }
  try {
    dslTree._setModelData(models);
  } catch (e) {
    Loger.error(`dsl/group.ts _setModelData()
      desc: 储存记录添加的MatchData
      error:${e}`);
  }
  try {
    dslTree._addNode(models);
  } catch (e) {
    Loger.error(`dsl/group.ts _addNode()
      desc: 元素重组
      error:${e}`);
  }

  try {
    // 创建layers
    dslTree.createLayer(dslTree._treeData);
  } catch (e) {
    Loger.error(`dsl/group.ts createLayer()
      desc: 创建layers
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
