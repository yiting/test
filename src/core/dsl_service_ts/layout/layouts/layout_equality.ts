// LayoutFlex下等分布局修正

import Utils from '../utils';
import Store from '../../helper/store';
import Constraints from '../../helper/constraints';
import { debug } from 'util';

let ErrorCoefficient: number = 0;
let designWidth: number = 0;

class LayoutEquality {
  /**
   * 对传进来的模型数组进行处理
   * @param {TreeNode} parent 树节点
   * @param {Array} nodes 树节点数组
   * @param {Array} models 对应的模型数组
   */
  handle(_parent: any, _nodes: any) {
    const that: any = this;
    // 剔除绝对定位元素
    const parent: any = _parent;
    const flexNodes = LayoutEquality.filterFlexNodes(_nodes);
    ErrorCoefficient = Store.get('errorCoefficient') || 0;
    designWidth = Store.get('designWidth') || 0;
    // 如果子节点不水平，则返回
    if (!Utils.isHorizontal(flexNodes)) {
      return;
    }

    // 如果小于两个节点，不处理
    if (flexNodes.length < 2) {
      return;
    }
    // 从左到右排列
    flexNodes.sort((a: any, b: any) => a.abX - b.abX);
    const _isAllCanFlex = LayoutEquality._isAllCanFlex(flexNodes);
    // 如果子节点类型不一样，则返回
    const _isAllSameModel = LayoutEquality._isAllSameModel(flexNodes);
    // 计算左对齐等分结果
    const leftSpace =
      _isAllCanFlex && LayoutEquality._isEqualityLeft(flexNodes, parent);
    // 计算中对齐等分结果
    const centerSpace =
      _isAllSameModel && LayoutEquality._isEqualityCenter(flexNodes, parent);
    // 计算两端对齐结果
    const aroundArr = LayoutEquality._isAround(flexNodes);
    // 计算前节点内容是否中对齐等分
    const prevLineIsJustifyCenter =
      centerSpace && LayoutEquality._prevLineIsJustifyCenter(flexNodes, parent);
    const nextLineIsJustifyCenter =
      centerSpace && LayoutEquality._nextLineIsJustifyCenter(flexNodes, parent);
    // 当前节点是否居中等分
    const isJustifyAround =
      centerSpace && LayoutEquality._isJustifyAround(flexNodes, parent);

    if (
      // 如果有中心间距，并且居中|与上一行对齐|与下一行对齐
      centerSpace &&
      (isJustifyAround || prevLineIsJustifyCenter || nextLineIsJustifyCenter)
    ) {
      LayoutEquality._adjustCenterPos(
        flexNodes,
        centerSpace,
        prevLineIsJustifyCenter,
      );
      parent.constraints.LayoutJustifyContent =
        Constraints.LayoutJustifyContent.Center;
    } else if (aroundArr) {
      // 两端对齐
      LayoutEquality._adjustAround(flexNodes);
      parent.constraints.LayoutPosition = Constraints.LayoutPosition.Absolute;
      parent.constraints.LayoutJustifyContent =
        Constraints.LayoutJustifyContent.Center;
    } else if (leftSpace) {
      LayoutEquality._adjustLeftPos(flexNodes, leftSpace);
      parent.constraints.LayoutJustifyContent =
        Constraints.LayoutJustifyContent.Start;
    }
  }

  static filterFlexNodes(nodes: any) {
    return nodes.filter(
      (nd: any) =>
        nd.constraints &&
        nd.constraints.LayoutSelfPosition !==
          Constraints.LayoutSelfPosition.Absolute,
    );
  }
  /**
   * 两端对齐
   * @param parent
   * @param flexNodes
   */
  static _isAround(flexNodes: any) {
    if (flexNodes.length > 3) {
      return;
    }

    const centerNode: any = flexNodes.find((nd: any) => {
      return Math.abs(nd.abX + nd.abXops - designWidth) < ErrorCoefficient;
    });
    const centerIndex = flexNodes.indexOf(centerNode);
    const prev: any = flexNodes[centerIndex - 1];
    const next: any = flexNodes[centerIndex + 1];
    let fixed = false;
    if (centerNode && prev && next) {
      fixed =
        prev.abX > 0 &&
        next.abXops < designWidth &&
        (centerNode.abX - prev.abXops) / designWidth >= 0.09 &&
        (next.abX - centerNode.abXops) / designWidth >= 0.09 &&
        Math.abs(prev.abX - (designWidth - next.abXops)) <= ErrorCoefficient;
    } else if (centerNode && prev) {
      fixed = prev.abX > 0 && prev.abX / designWidth < 0.1;
    } else if (centerNode && next) {
      fixed = next.abXops < designWidth && next.abXops / designWidth > 0.9;
    }

    return fixed && [prev, centerNode, next];
  }
  static _adjustAround(nodes: any) {
    const [prev, cur, next] = nodes;
    if (prev) {
      // prev
      prev.constraints.LayoutSelfPosition =
        Constraints.LayoutSelfPosition.Absolute;
      prev.constraints.LayoutSelfHorizontal =
        Constraints.LayoutSelfHorizontal.Left;
    }
    if (next) {
      // next
      next.constraints.LayoutSelfPosition =
        Constraints.LayoutSelfPosition.Absolute;
      next.constraints.LayoutSelfHorizontal =
        Constraints.LayoutSelfHorizontal.Right;
    }
  }
  static _nextLineIsJustifyCenter(nodes: any, node: any) {
    if (!node.parent) {
      return false;
    }
    const nodeIndex = node.parent.children.indexOf(node);
    const next = node.parent.children[nodeIndex + 1];
    const nextChildren = next && LayoutEquality.filterFlexNodes(next.children);
    const result: any[] = [];
    return (
      nextChildren &&
      nextChildren.length == nodes.length &&
      nodes.every((nd: any, i: number) => {
        const pd = nextChildren[i];
        result.push({
          abX: pd.abX,
          abXops: pd.abXops,
        });
        return (
          Math.abs((nd.abX + nd.abXops - (pd.abX + pd.abXops)) / 2) <
          ErrorCoefficient
        );
      }) &&
      result
    );
  }
  static _prevLineIsJustifyCenter(nodes: any, node: any) {
    if (!node.parent) {
      return false;
    }
    const nodeIndex = node.parent.children.indexOf(node);
    const prev = node.parent.children[nodeIndex - 1];
    const prevChildren = prev && LayoutEquality.filterFlexNodes(prev.children);
    const result: any[] = [];
    return (
      prevChildren &&
      prevChildren.length == nodes.length &&
      nodes.every((nd: any, i: number) => {
        const pd = prevChildren[i];
        result.push({
          abX: pd.abX,
          abXops: pd.abXops,
        });
        return (
          Math.abs((nd.abX + nd.abXops - (pd.abX + pd.abXops)) / 2) <
          ErrorCoefficient
        );
        /* 
        // 计算是否对齐函数
        const range = .1
        const ndC = (nd.abX + nd.abXops) / 2
        const ndCX = ndC - (nd.abXops - nd.abX) * range
        const ndCXops = ndC + (nd.abXops - nd.abX) * range
        const pdC = (pd.abX + pd.abXops) / 2
        const pdCX = pdC - (pd.abXops - pd.abX) * range
        const pdCXops = pdC + (pd.abXops - pd.abX) * range
        if (
          (ndCX > pdCX && ndCXops < pdCXops) ||
          (ndCX < pdCX && ndCXops > pdCXops)
        ) {
          return true;
        } */
      }) &&
      result
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
  static _adjustCenterPos(nodes: any, width: any, prevLineCenterPos: any) {
    nodes.forEach((_nd: any, i: number) => {
      const nd: any = _nd;
      const ndWidth = nd.abXops - nd.abX;
      const dir = Math.floor((width - ndWidth) / 2);
      const abX = prevLineCenterPos ? prevLineCenterPos[i].abX : nd.abX - dir;
      const abXops = prevLineCenterPos
        ? prevLineCenterPos[i].abXops
        : nd.abXops + dir;
      nd.set('abX', abX);
      nd.set('abXops', abXops);
      // 设置居中
      nd.constraints.LayoutJustifyContent =
        Constraints.LayoutJustifyContent.Center;
      nd.constraints.LayoutFixedWidth = Constraints.LayoutFixedWidth.Fixed;
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
        Constraints.LayoutJustifyContent.Start;
      nd.constraints.LayoutFixedWidth = Constraints.LayoutFixedWidth.Fixed;
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
    // 验证新节点都包含原节点范围
    const isContain = nodes.every((nd: any) => {
      return maybeDir > nd.abXops - nd.abX;
    });
    if (!isContain) {
      return false;
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
    const newDir: any[] = [];
    const isContain = nodes.every((n: any) => {
      newDir.push({
        abX: (n.abX + n.abXops) / 2 - maybeDir / 2,
        abXops: (n.abX + n.abXops) / 2 + maybeDir / 2,
      });
      return n.abXops - n.abX <= maybeDir;
    });
    if (!isContain) {
      return false;
    }
    // 验证新节点间相邻却不相交
    const isNotIntersect = newDir.every((dir: any, i: number) => {
      const prevDir: any = newDir[i - 1];
      return (
        prevDir === undefined ||
        (dir.abX - prevDir.abXops >= 0 &&
          dir.abX - prevDir.abXops <= ErrorCoefficient)
      );
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
