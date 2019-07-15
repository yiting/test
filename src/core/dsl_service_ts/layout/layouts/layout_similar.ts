// 循环结构的逻辑处理模块
import Common from '../../dsl2/common';
import Utils from '../utils';
import Constraints from '../../helper/constraints';
import Store from '../../helper/store';

let ErrorCoefficient: number = 0;

class LayoutSimilar {
  similarIndex: number;

  constructor() {
    this.similarIndex = 1;
  }

  /**
   * 主流程：对传进来的模型数组进行循环分析处理
   * @param {TreeNode} parent 树节点
   */
  handle(parent: any) {
    const that: any = this;
    that._compareNodes = {};
    // 找出所有需要对比的结构
    this._filterCompareNodes(parent);

    ErrorCoefficient = Store.get('errorCoefficient') || 0;
    // 找出相似结构组合
    Object.keys(that._compareNodes).forEach(key => {
      const compareNodes = that._compareNodes[key];
      compareNodes.sort(
        (a: any, b: any) => a.width * a.height - b.width * b.height,
      );
      // 找到相似结构
      const similarArr = Utils.gatherByLogic(
        compareNodes,
        LayoutSimilar._similarRule,
      );
      // 相似结构处理
      this._setSimilar(similarArr);
    });
  }

  // 相似结构处理
  _setSimilar(similarArr: any) {
    if (similarArr.length === 0) {
      // 如果没有相似结构，则返回
      return;
    }
    // 遍历循环节点
    similarArr.forEach((item: any) => {
      // 如果组内只有一个节点，说明没有相似
      const that: any = this;
      if (item.length === 1) return;
      const similarId = that.similarIndex;
      that.similarIndex += 1;
      item.forEach((obj: any) => {
        obj.node.set('similarId', similarId);
      });
    });
  }

  /**
   * 筛选参与判断的元素
   * @param {Array} node
   */
  _filterRule(node: any) {
    // 剔除绝对定位元素，绝对定位元素不参与循环判断
    if (
      node.constraints.LayoutSelfPosition ===
      Constraints.LayoutSelfPosition
        .Absolute /*  ||
      (node.modelName !== 'layer' && node.type !== Common.QWidget) */
    ) {
      return;
    }
    const that: any = this;
    if (!that._compareNodes[node.modelName]) {
      that._compareNodes[node.modelName] = [];
    }
    const compareChildren = node.children.filter(
      (child: any) =>
        child.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute,
    );
    that._compareNodes[node.modelName].push({
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
      modelName: node.modelName,
      type: node.type,
      isHorizontal: Utils.isHorizontal(compareChildren),
      compareChildren: compareChildren,
    });
  }

  // 遍历所有结构
  _filterCompareNodes(node: any) {
    this._filterRule(node);
    if (node.children) {
      node.children.forEach((nd: any) => this._filterCompareNodes(nd));
    }
  }

  // 相似节点逻辑
  static _similarRule(a: any, b: any): boolean {
    // if(b.node.id=="B3133B0B-4CE4-47B1-B1C5-0681FE750B16-c"&&a.node.id=="06F4A3D3-B7FD-448C-AB6E-F060580B7402-c")debugger
    /**
     * 逻辑：
     * 1. 模型名称相似
     * 2. 如果是layer，layer子节点相似,三基线对齐
     * 3. 如果非layer，三基线对齐
     * 4. 如果没有子节点，则相似
     */
    if (a.type !== b.type || a.modelName !== b.modelName) {
      return false;
    }
    const isConnect = Utils.isConnect(a.node, b.node, -1);
    if (isConnect) {
      // 如果相连，则为不同
      return false;
    }

    // 如果为布局类型，判断所有子节点是否相似
    if (
      a.type === Common.QLayer ||
      // 部分shape是一个包含子节点的layer，故增加以下一条判断条件
      ((a.type === Common.QShape || a.type === Common.QImage) &&
        (a.compareChildren.length > 0 || b.compareChildren.length > 0))
    ) {
      return (
        a.isHorizontal === b.isHorizontal &&
        a.compareChildren.length === b.compareChildren.length &&
        a.compareChildren.every((aChild: any, i: any) => {
          const bChild = b.compareChildren[i];
          return (
            aChild.modelName === bChild.modelName &&
            (aChild.abX - a.abX - (bChild.abX - b.abX) < ErrorCoefficient ||
              aChild.abXops - a.abXops - (bChild.abXops - b.abXops) <
                ErrorCoefficient) &&
            (aChild.abY - a.abY - (bChild.abY - b.abY) < ErrorCoefficient ||
              aChild.abYops - a.abYops - (bChild.abYops - b.abYops) <
                ErrorCoefficient)
          );
        }) &&
        ((Math.abs(a.abYops - a.abY - b.abYops + b.abY) < ErrorCoefficient &&
          (Math.abs(a.abX - b.abX) < ErrorCoefficient ||
            Math.abs(a.abXops - b.abXops) < ErrorCoefficient ||
            Math.abs(a.ctX - b.ctX) < ErrorCoefficient)) ||
          (Math.abs(a.abXops - a.abX - b.abXops + b.abX) < ErrorCoefficient &&
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
    } else if (a.type === Common.QWidget) {
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
    } else if (a.type !== Common.QText) {
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
}

export default new LayoutSimilar();
