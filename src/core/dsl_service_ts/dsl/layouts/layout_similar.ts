// 循环结构的逻辑处理模块
import Common from '../common';
import Utils from '../utils';
import Model from '../model';
import Group from '../group';
import Constraints from '../constraints';

class LayoutSimilar extends Model.LayoutModel {
  similarIndex: number;

  constructor() {
    super();
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
      isHorizontal: Utils.isHorizontal(node.children),
      compareChildren: node.children.filter(
        (child: any) =>
          child.constraints.LayoutSelfPosition !==
          Constraints.LayoutSelfPosition.Absolute,
      ),
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
    /**
     * 逻辑：
     * 1. 模型名称相似
     * 2. 如果是layer，layer子节点相似,三基线对齐
     * 3. 如果非layer，三基线对齐
     * 4. 如果没有子节点，则相似
     */
    if (
      b.node.id == '6355FC4D-7ACA-40D6-90CF-A84D53F4C2BA-c' &&
      a.node.id == '4CAE32F6-9A8F-4C0A-930F-4958FCAEE87B-c'
    )
      debugger;
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
      (a.type === Common.QShape && a.compareChildren.length > 0)
    ) {
      return (
        a.isHorizontal === b.isHorizontal &&
        a.compareChildren.length === b.compareChildren.length &&
        a.compareChildren.every((ac: any, i: any) => {
          const bc = b.compareChildren[i];
          return (
            ac.modelName === bc.modelName &&
            (ac.abX - a.abX == bc.abX - b.abX ||
              ac.abXops - a.abXops == bc.abXops - b.abXops) &&
            (ac.abY - a.abY == bc.abY - b.abY ||
              ac.abYops - a.abYops == bc.abYops - b.abYops)
          );
        }) &&
        ((a.height === b.height &&
          (a.abX === b.abX || a.abXops === b.abXops || a.ctX === b.ctX)) ||
          (a.width === b.width &&
            (a.abY === b.abY || a.abYops === b.abYops || a.ctY === b.ctY / 2)))
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
        a.abY === b.abY ||
        a.abYops === b.abYops ||
        a.ctY === b.ctY ||
        a.abX === b.abX ||
        a.abXops === b.abXops ||
        a.ctX === b.ctX ||
        (a.width === b.width && a.height === b.height)
      );
    } else if (a.type !== Common.QText) {
      // 如果为其他元素（非文本），则同父节点，子节点数相同，三线对齐相同
      return (
        a.parentId === b.parentId &&
        (a.abY === b.abY ||
          a.abYops === b.abYops ||
          a.ctY === b.ctY ||
          a.abX === b.abX ||
          a.abXops === b.abXops ||
          a.ctX === b.ctX)
      );
    }
  }
}

export default new LayoutSimilar();
