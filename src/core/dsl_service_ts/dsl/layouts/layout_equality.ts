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
    // 剔除绝对定位元素
    const flexNodes = nodes.filter(
      (nd: any) =>
        nd.constraints &&
        nd.constraints.LayoutSelfPosition !==
          Constrains.LayoutSelfPosition.Absolute,
    );
    // 如果小于两个节点，不处理
    if (flexNodes.length < 2) {
      return;
    }
    // 从左到右排列
    flexNodes.sort((a: any, b: any) => a.abX - b.abX);
    if (!LayoutEquality._isAllCanFlex(flexNodes)) {
      return;
    }
    // 如果子节点类型不一样，则返回
    if (!LayoutEquality._isAllSameModel(flexNodes)) {
      return;
    }
    // 如果子节点不水平，则返回
    if (!Utils.isHorizontal(flexNodes)) {
      return;
    }
    const leftSpace = LayoutEquality._isEqualityLeft(flexNodes, parent);
    const centerSpace = LayoutEquality._isEqualityCenter(flexNodes, parent);
    if (centerSpace) {
      LayoutEquality._adjustCenterPos(flexNodes, centerSpace);
      parent.constraints.LayoutJustifyContent =
        Constrains.LayoutJustifyContent.Center;
    } else if (leftSpace) {
      LayoutEquality._adjustLeftPos(flexNodes, leftSpace);
      parent.constraints.LayoutJustifyContent =
        Constrains.LayoutJustifyContent.Start;
    }
  }

  static _isAllCanFlex(nodes: any) {
    return nodes.every((node: any) => {
      return node.canLeftFlex !== false && node.canRightFlex !== false;
    });
  }
  //  调整居中模型位置
  static _adjustCenterPos(nodes: any, width: any) {
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
    });
  }
  //  调整居中模型位置
  static _adjustLeftPos(nodes: any, width: any) {
    nodes.forEach((_nd: any) => {
      const nd: any = _nd;
      nd.set('abXops', nd.abX + width);
      // 设置居中
      nd.constraints.LayoutJustifyContent =
        Constrains.LayoutJustifyContent.Start;
      nd.constraints.LayoutFixedWidth = Constrains.LayoutFixedWidth.Fixed;
      nd.set('constraints', nd.constraints);
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

  /**
   * 左对齐等分要求
   * 节点间距相等
   */
  static _isEqualityLeft(nodes: any, parent: any) {
    const COEFFICIENT = 3;
    // 左右间距判断
    const firstNode = nodes[0];
    const secondNode = nodes[1];
    const lastNode = nodes[nodes.length - 1];
    const leftSide = firstNode.abX - parent.abX;
    const rightSide = leftSide;
    // 假设最大宽度为元素左边距的距离
    let maybeDir = secondNode.abX - firstNode.abX;
    // 左边界数组
    const dirArr: any = [];
    // 计算左间距
    nodes.forEach((node: any, i: any) => {
      const prev = nodes[i - 1];
      if (prev) {
        const dir = node.abX - prev.abX;
        dirArr.push(dir);
      }
    });

    dirArr.sort((a: number, b: number) => a - b);
    const firstDir = dirArr[0];
    const lastDir = dirArr[dirArr.length];
    // 如果最大和最小间距差大于系数，则不符合
    if (Math.abs(lastDir - firstDir) > COEFFICIENT) {
      return false;
    }
    const lastNodeAbXops = lastNode.abX + maybeDir;
    const paddingRightAbX = parent.abXops - rightSide;
    /**
     * 1. 如果末节点的右边界超出父节点范围，不处理
     * 2. 如果末节点的右边界未达到父节点padding-right边界，不处理
     * 3. 如果末节点的右边界在父节点的padding-right内，则裁剪“假设宽度”maybeDir
     */
    if (lastNodeAbXops < parent.abXops && lastNodeAbXops > paddingRightAbX) {
      maybeDir = maybeDir - (lastNodeAbXops - paddingRightAbX);
    }

    return maybeDir;
  }

  /**
   * 中心点等分要求
   * 左右边距相等，节点间距相等
   */
  static _isEqualityCenter(nodes: any, parent: any) {
    const COEFFICIENT = 3;
    // 左右间距判断
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    let leftSide = (firstNode.abX + firstNode.abXops) / 2 - parent.abX;
    let rightSide = parent.abXops - (lastNode.abX + lastNode.abXops) / 2;
    if (Math.abs(leftSide - rightSide) > COEFFICIENT) {
      return false;
    }
    // 中心点数组
    const dirArr: any = [];
    // 得出间距数组
    nodes.some((nd: any, i: any) => {
      const prev = nodes[i - 1];
      if (prev) {
        const ctr = (nd.abX + nd.abXops) / 2;
        const prevCtr = (prev.abX + prev.abXops) / 2;
        const dir = ctr - prevCtr;
        dirArr.push(dir);
      }
    });
    dirArr.sort((a: number, b: number) => a - b);
    const firstDir = dirArr[0];
    const lastDir = dirArr[dirArr.length - 1];
    // 如果最大和最小间距差大于系数，则不符合
    if (Math.abs(lastDir - firstDir) > COEFFICIENT) {
      return false;
    }
    return Math.min(...[leftSide * 2, rightSide * 2, ...dirArr]);
  }
}

export default new LayoutEquality();
