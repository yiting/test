// LayoutFlex下等分布局修正

import Common from '../common';
import Model from '../model';
import Utils from '../utils';
import Constrains from '../constraints';

class LayoutEquality extends Model.LayoutModel {
  /**
   * 对传进来的模型数组进行处理
   * @param {TreeNode} parent 树节点
   * @param {Array} nodes 树节点数组
   * @param {Array} models 对应的模型数组
   * @param {Int} layoutType 布局的类型
   */
  handle(_parent: any, _nodes: any) {
    const that: any = this;
    const parent: any = _parent;
    const nodes: any = _nodes;

    const flexNodes = nodes.filter(
      (nd: any) =>
        nd.constraints &&
        nd.constraints.LayoutSelfPosition !==
          Constrains.LayoutSelfPosition.Absolute,
    );
    if (flexNodes.length < 2) {
      return;
    }
    flexNodes.sort((a: any, b: any) => a.abX - b.abX);
    // 如果子节点不一样，则返回
    if (!LayoutEquality._isAllSameModel(flexNodes)) {
      return;
    }
    // 如果子节点不水平，则返回
    if (!Utils.isHorizontal(flexNodes)) {
      return;
    }
    // 如果边距不一致，则返回
    const minSide = LayoutEquality._isEqualitySide(flexNodes, parent);
    if (!minSide) {
      return;
    }
    const minDir = LayoutEquality._isEqualityBetween(flexNodes);
    // 如果间距不一致，则返回
    if (!minDir) {
      return;
    }
    const minSpace = Math.min(minSide * 2, minDir);
    LayoutEquality._adjustModelPos(flexNodes, minSpace);
    parent.constraints.LayoutJustifyContent =
      Constrains.LayoutJustifyContent.Center;
  }

  static _adjustModelPos(nodes: any, width: any) {
    nodes.forEach((_nd: any) => {
      const nd: any = _nd;
      const ndWidth = nd.abXops - nd.abX;
      const dir = Math.floor(width - ndWidth) / 2;
      nd.set('abX', nd.abX - dir);
      nd.set('abXops', nd.abXops + dir);
      // 设置居中
      nd.constraints.LayoutJustifyContent =
        Constrains.LayoutJustifyContent.Center;
      nd.constraints.LayoutFixedWidth = Constrains.LayoutFixedWidth.Fixed;
      nd.set('constraints', nd.constraints);
      /**
       * bug：width渲染失效
       */
    });
  }

  static _isAllSameModel(nodes: any) {
    let modelName: any;

    return (
      nodes.length > 1 &&
      nodes.every((nd: any) => {
        const isSameModel = !modelName || nd.modelName === modelName;
        ({ modelName } = nd);
        return isSameModel;
      })
    );
  }

  static _isEqualitySide(nodes: any, parent: any) {
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    const left = firstNode.abX - parent.abX;
    const right = parent.abXops - lastNode.abXops;
    const isEq = Math.abs(left - right) < 4;

    return (
      isEq &&
      Math.min(
        left + (firstNode.abXops - firstNode.abX) / 2,
        right + (lastNode.abXops - lastNode.abX) / 2,
      )
    );
  }

  static _isEqualityBetween(nodes: any) {
    // 中心点数组
    const dirArr: any = [];
    const centerArr = nodes.map((nd: any) => (nd.abX + nd.abXops) / 2);
    // 最小间距
    let minDir = Number.MAX_VALUE;
    centerArr.forEach((ctr: any, i: any) => {
      const prevCtr = centerArr[i - 1];
      if (prevCtr) {
        const dir = ctr - prevCtr;
        dirArr.push(dir);
        minDir = dir < minDir ? dir : minDir;
      }
    });
    // 间距是否相等
    let isEq = true;
    dirArr.forEach((dir: any, i: any) => {
      const prevDir = dirArr[i - 1];
      // 中心间距差小于4
      isEq = isEq && (!prevDir || Math.abs(prevDir - dir) < 4);
    });
    return isEq && minDir;
  }
}

export default new LayoutEquality();
