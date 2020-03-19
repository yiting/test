// 循环结构的逻辑处理模块
import Dictionary from '../../../dsl_helper/dictionary';
import Utils from '../../../dsl_helper/methods';
import * as Constraints from '../../../dsl_helper/constraints';

let _compareNodes: any = {};

/**
 * 主流程：对传进来的模型数组进行循环分析处理
 * @param {TreeNode} parent 树节点
 */

// 相似结构处理
function _setSimilar(similarArr: any) {
  if (similarArr.length === 0) {
    // 如果没有相似结构，则返回
    return;
  }
  // 遍历循环节点
  similarArr.forEach((item: any) => {
    // 如果组内只有一个节点，说明没有相似
    if (item.length === 1) return;
    const similarId = res.similarIndex;
    res.similarIndex += 1;
    item.forEach((obj: any) => {
      obj.similarId = similarId;
    });
  });
}

/**
 * 筛选参与判断的元素
 * @param {Array} node
 */
function _filterRule(node: any) {
  // 剔除绝对定位元素，绝对定位元素不参与相似判断
  if (node.constraints.LayoutPosition === Constraints.LayoutPosition.Absolute) {
    return;
  }
  if (!_compareNodes[node.constructor.name]) {
    _compareNodes[node.constructor.name] = [];
  }
  _compareNodes[node.constructor.name].push(node);
}

// 遍历所有结构
function _filterCompareNodes(node: any) {
  _filterRule(node);
  if (node.children) {
    node.children.forEach((nd: any) => _filterCompareNodes(nd));
  }
}
// 相似节点逻辑
function _similarRule(a: any, b: any): boolean {
  /**
   * 逻辑：
   * 1. 模型名称相似
   * 2. 如果是layer，layer子节点相似,三基线对齐
   * 3. 如果非layer，三基线对齐
   * 4. 如果没有子节点，则相似
   */
  if (a.type !== b.type || a.constructor !== b.constructor) {
    return false;
  }
  const isConnect = Utils.isConnect(a, b, -1);
  if (isConnect) {
    // 如果相连，则为不同
    return false;
  }
  return a.isSimilarWith(b);
}
function handle(parent: any) {
  res.similarIndex = 1;
  // 找出所有需要对比的结构
  _filterCompareNodes(parent);
  // 找出相似结构组合
  Object.keys(_compareNodes).forEach(key => {
    const compareNodes = _compareNodes[key];
    compareNodes.sort(
      (a: any, b: any) => a.width * a.height - b.width * b.height,
    );
    // 找到相似结构
    const similarArr = Utils.gatherByLogic(compareNodes, _similarRule);
    // 相似结构处理
    _setSimilar(similarArr);
  });
}
let res = {
  handle,
  similarIndex: 1,
};
export default res;
