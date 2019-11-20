// 循环结构的逻辑处理模块
import Dictionary from '../../helper/dictionary';
import Utils from '../../helper/methods';
import Constraints from '../../helper/constraints';
import Store from '../../helper/store';

let ErrorCoefficient: number = 0;
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
      obj.node.similarId = similarId;
    });
  });
}

/**
 * 筛选参与判断的元素
 * @param {Array} node
 */
function _filterRule(node: any) {
  // 剔除绝对定位元素，绝对定位元素不参与循环判断
  if (
    node.constraints.LayoutSelfPosition ===
    Constraints.LayoutSelfPosition
      .Absolute /*  ||
      (node.modelName !== 'layer' && node.type !== Common.QWidget) */
  ) {
    return;
  }
  if (!_compareNodes[node.constructor.name]) {
    _compareNodes[node.constructor.name] = [];
  }
  let compareChildren = node.children.filter(
    (child: any) =>
      child.constraints.LayoutSelfPosition !==
      Constraints.LayoutSelfPosition.Absolute,
  );
  _compareNodes[node.constructor.name].push({
    node,
    abX: node.abX,
    abXops: node.abXops,
    abY: node.abY,
    abYops: node.abYops,
    ctX: (node.abX + node.abXops) / 2,
    ctY: (node.abY + node.abYops) / 2,
    height: node.abYops - node.abY,
    width: node.abXops - node.abX,
    parentId: node.parentId,
    type: node.type,
    isHorizontal: Utils.isHorizontal(compareChildren),
    compareChildren: compareChildren,
  });
  return _compareNodes;
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
  const isConnect = Utils.isConnect(a.node, b.node, -1);
  if (isConnect) {
    // 如果相连，则为不同
    return false;
  }

  // 如果为布局类型，判断所有子节点是否相似
  if (
    a.type === Dictionary.type.QLayer ||
    // 部分图片是一个包含子节点的layer，故增加以下一条判断条件
    (a.type === Dictionary.type.QImage &&
      (a.compareChildren.length > 0 || b.compareChildren.length > 0))
  ) {
    return (
      a.isHorizontal === b.isHorizontal &&
      a.compareChildren.length === b.compareChildren.length &&
      a.compareChildren.every((aChild: any, i: any) => {
        const bChild = b.compareChildren[i];
        return (
          aChild.constructor === bChild.constructor &&
          (aChild.abX - a.abX - (bChild.abX - b.abX) < ErrorCoefficient ||
            aChild.abXops - a.abXops - (bChild.abXops - b.abXops) <
              ErrorCoefficient) &&
          (aChild.abY - a.abY - (bChild.abY - b.abY) < ErrorCoefficient ||
            aChild.abYops - a.abYops - (bChild.abYops - b.abYops) <
              ErrorCoefficient)
        );
      }) &&
      (// 水平中线对齐
      (Math.abs(a.abYops - a.abY - b.abYops + b.abY) < ErrorCoefficient &&
        // 左、中、右对齐
        (Math.abs(a.abX - b.abX) < ErrorCoefficient ||
          Math.abs(a.abXops - b.abXops) < ErrorCoefficient ||
          Math.abs(a.ctX - b.ctX) < ErrorCoefficient)) ||
        // 垂直中线对齐
        (Math.abs(a.abXops - a.abX - b.abXops + b.abX) < ErrorCoefficient &&
          // 上、中、下对齐
          (Math.abs(a.abY - b.abY) < ErrorCoefficient ||
            Math.abs(a.abYops - b.abYops) < ErrorCoefficient ||
            Math.abs(a.ctY - b.ctY) < ErrorCoefficient)))
      /* (
        (a.height === b.height || a.width === b.width) &&
        (a.abX === b.abX || a.abXops === b.abXops || a.ctX === b.ctX ||
          a.abY === b.abY || a.abYops === b.abYops || a.ctY === b.ctY / 2)
      ) */
    );
    // 如果为组件类型，判断位置是否相似
  } else if (a.type === Dictionary.type.QWidget) {
    // 如果为Widget，三线对齐相同
    return (
      Math.abs(a.abY - b.abY) < ErrorCoefficient ||
      Math.abs(a.abYops - b.abYops) < ErrorCoefficient ||
      Math.abs(a.ctY - b.ctY) < ErrorCoefficient ||
      Math.abs(a.abX - b.abX) < ErrorCoefficient ||
      Math.abs(a.abXops - b.abXops) < ErrorCoefficient ||
      Math.abs(a.ctX - b.ctX) < ErrorCoefficient ||
      (Math.abs(a.width - b.width) < ErrorCoefficient &&
        Math.abs(a.height - b.height) < ErrorCoefficient)
    );
  } else if (a.type !== Dictionary.type.QText) {
    // 如果为其他元素（非文本），则同父节点，子节点数相同，三线对齐相同
    const nodeA = a.node;
    const nodeB = b.node;
    return (
      /* a.parentId === b.parentId &&
      (a.abY === b.abY ||
        a.abYops === b.abYops ||
        a.ctY === b.ctY ||
        a.abX === b.abX ||
        a.abXops === b.abXops ||
        a.ctX === b.ctX) */
      Math.abs(a.abYops - a.abY - (b.abYops - b.abY)) < ErrorCoefficient &&
      Math.abs(a.abXops - a.abX - (b.abXops - b.abX)) < ErrorCoefficient &&
      nodeA.styles &&
      nodeB.styles &&
      // 圆角相同
      ((nodeA.styles.borderRadius === null &&
        nodeB.styles.borderRadius === null) ||
        (nodeA.styles.borderRadius &&
          nodeB.styles.borderRadius &&
          nodeA.styles.borderRadius.join() ==
            nodeB.styles.borderRadius.join())) &&
      // nodeA.styles.shadows === nodeB.styles.shadows &&
      // 边框宽度相同
      ((nodeA.styles.border === null && nodeB.styles.border === null) ||
        (nodeA.styles.border &&
          nodeB.styles.border &&
          nodeA.styles.border.width === nodeB.styles.border.width))
    );
  }
}
function handle(parent: any) {
  res.similarIndex = 1;
  ErrorCoefficient = Store.get('errorCoefficient') || 0;
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
