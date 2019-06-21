// LayoutFlex下等分布局修正

import Common from '../common';
import Model from '../model';
import Utils from '../utils';
import Store from '../../helper/store';
import Constrains from '../constraints';

let ErrorCoefficient: number = 0;
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
    const flexNodes = LayoutEquality.filterFlexNodes(nodes);

    ErrorCoefficient = Store.get('errorCoefficient') || 0;
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
    // 计算左对齐等分结果
    const leftSpace = LayoutEquality._isEqualityLeft(flexNodes, parent);
    // 计算中对齐等分结果
    const centerSpace = LayoutEquality._isEqualityCenter(flexNodes, parent);
    // 计算前节点内容是否中对齐等分
    const prevLineIsJustifyCenter = LayoutEquality._prevLineIsJustifyCenter(
      flexNodes,
      parent,
    );
    // 当前节点是否居中等分
    const isJustifyAround = LayoutEquality._isJustifyAround(flexNodes, parent);

    if (centerSpace && (isJustifyAround || prevLineIsJustifyCenter)) {
      LayoutEquality._adjustCenterPos(flexNodes, centerSpace);
      parent.constraints.LayoutJustifyContent =
        Constrains.LayoutJustifyContent.Center;
    } else if (leftSpace) {
      LayoutEquality._adjustLeftPos(flexNodes, leftSpace);
      parent.constraints.LayoutJustifyContent =
        Constrains.LayoutJustifyContent.Start;
    }
  }
  static filterFlexNodes(nodes: any) {
    return nodes.filter(
      (nd: any) =>
        nd.constraints &&
        nd.constraints.LayoutSelfPosition !==
          Constrains.LayoutSelfPosition.Absolute,
    );
  }
  static _prevLineIsJustifyCenter(nodes: any, node: any) {
    if (!node.parent) {
      return false;
    }
    const nodeIndex = node.parent.children.indexOf(node);
    const prev = node.parent.children[nodeIndex - 1];
    const prevChildren = prev && LayoutEquality.filterFlexNodes(prev.children);
    return (
      prevChildren &&
      prevChildren.length == nodes.length &&
      nodes.every((nd: any, i: number) => {
        const pd = prevChildren[i];
        return (
          Math.abs(nd.abX + nd.abXops - (pd.abX + pd.abXops)) < ErrorCoefficient
        );
      })
    );
  }
  static _isJustifyAround(nodes: any, parent: any) {
    // 左右间距判断
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    let leftSide = (firstNode.abX + firstNode.abXops) / 2 - parent.abX;
    let rightSide = parent.abXops - (lastNode.abX + lastNode.abXops) / 2;
    return Math.abs(leftSide - rightSide) < ErrorCoefficient;
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
    // 左右间距判断
    const firstNode = nodes[0];
    const secondNode = nodes[1];
    const lastNode = nodes[nodes.length - 1];
    const leftSide = firstNode.abX - parent.abX;
    const rightSide = leftSide;
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
    // 假设最大宽度为元素左边距的距离
    let maybeDir = dirArr[0];
    const firstDir = dirArr[0];
    const lastDir = dirArr[dirArr.length - 1];
    // 如果最大和最小间距差大于系数，则不符合
    if (Math.abs(lastDir - firstDir) > ErrorCoefficient) {
      return false;
    }
    const lastNodeAbXops = lastNode.abX + maybeDir;
    const paddingRightAbX = parent.abXops - rightSide;
    // 如果末节点原右边界未超出父节点范围，末节点新右边界超出父节点范围，不符合左等分
    if (lastNode.abXops < parent.abXops && lastNodeAbXops > parent.abXops) {
      return false;
    }

    //  如果末节点的右边界在父节点的padding-right内，则裁剪“假设宽度”maybeDir
    if (lastNodeAbXops <= parent.abXops && lastNodeAbXops > paddingRightAbX) {
      maybeDir = maybeDir - (lastNodeAbXops - paddingRightAbX);
    }

    return maybeDir;
  }

  /**
   * 中心点等分要求
   * 左右边距相等，节点间距相等
   */
  static _isEqualityCenter(nodes: any, parent: any) {
    // 左右间距判断
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    let leftSide = (firstNode.abX + firstNode.abXops) / 2 - parent.abX;
    let rightSide = parent.abXops - (lastNode.abX + lastNode.abXops) / 2;
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
    if (Math.abs(lastDir - firstDir) > ErrorCoefficient) {
      return false;
    }
    // 获取目标宽度
    const maybeDir = Math.min(...[leftSide * 2, rightSide * 2, ...dirArr]);
    // 验证新节点都包含原节点范围
    const newDir: number[] = [];
    const isContain = nodes.every((n: any) => {
      newDir.push((n.abX + n.abXops) / 2 - maybeDir / 2);
      newDir.push((n.abX + n.abXops) / 2 + maybeDir / 2);
      return n.abXops - n.abX >= maybeDir;
    });
    if (!isContain) {
      return false;
    }
    // 验证新节点间不相交
    const isNotIntersect = newDir.every((dir: number, i: number) => {
      const prevDir = newDir[i - 1];
      return prevDir === undefined || prevDir <= dir;
    });
    if (!isNotIntersect) {
      return false;
    }
    // 验证不超过左测边界
    if ((firstNode.abX + firstNode.abXops) / 2 - maybeDir / 2 < parent.abX) {
      return false;
    }
    // 验证不超过右侧边界
    if (
      lastNode.abXops < parent.abXops &&
      (lastNode.abXops + lastNode.abX) / 2 + maybeDir / 2 > parent.abXops
    ) {
      return false;
    }

    return maybeDir;
  }
}

export default new LayoutEquality();
