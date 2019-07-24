import Utils from '../utils';

class LayoutSort {
  /* constructor(modelType: any) {
    super(modelType);
  } */

  /**
   * 对传进来的模型数组进行处理
   * @param {TreeNode} parent 树节点
   * @param {Array} nodes 树节点数组
   * @param {Array} models 对应的模型数组
   */
  static handle(parent: any, nodes: any, models: any) {
    // if (this._isVerticalLayout(nodes)) {
    if (Utils.isHorizontal(nodes)) {
      LayoutSort._sort(nodes, 'abX');
    } else {
      LayoutSort._sort(nodes, 'abY');
    }
  }

  // 筛选前排序
  static _sort(nodes: any, opt: any) {
    nodes.sort((a: any, b: any) => a[opt] - b[opt]);
  }
}

export default LayoutSort;
