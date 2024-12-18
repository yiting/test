// LayoutFlex下等分布局修正

import Utils from '../../../dsl_helper/methods';
import Store from '../../../dsl_helper/store';
import * as Constraints from '../../../dsl_helper/constraints';
import Dictionary from '../../../dsl_helper/dictionary';
import { debug } from 'util';

let ErrorCoefficient: number = 0;
let designWidth: number = 0;

/**
 * 两端对齐
 * @param parent
 * @param flexNodes
 */
function isAround(flexNodes: any) {
  if (flexNodes.length > 3) {
    return;
  }

  let centerNode: any = flexNodes.find((nd: any) => {
    return Math.abs(nd.abX + nd.abXops - designWidth) < ErrorCoefficient;
  });
  let centerIndex = flexNodes.indexOf(centerNode);
  let prev: any = flexNodes[centerIndex - 1];
  let next: any = flexNodes[centerIndex + 1];
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
function adjustAround(nodes: any) {
  let [prev, cur, next] = nodes;
  if (prev) {
    // prev
    prev.constraints.LayoutPosition = Constraints.LayoutPosition.Absolute;
    prev.constraints.LayoutSelfHorizontal =
      Constraints.LayoutSelfHorizontal.Left;
  }
  if (next) {
    // next
    next.constraints.LayoutPosition = Constraints.LayoutPosition.Absolute;
    next.constraints.LayoutSelfHorizontal =
      Constraints.LayoutSelfHorizontal.Right;
  }
}
function calLineIsJustify(
  nodes: any,
  node: any,
  distance: number,
  align: string,
) {
  if (!node.parent) {
    return false;
  }
  let nodeIndex = node.parent.children.indexOf(node);
  let line = node.parent.children[nodeIndex + distance];
  let lineChildren = line && Utils.filterAbsNode(line.children);
  let result: any[] = [];
  return (
    lineChildren &&
    lineChildren.length == nodes.length &&
    nodes.every((nd: any, i: number) => {
      let pd = lineChildren[i];
      result.push({
        abX: pd.abX,
        abXops: pd.abXops,
      });
      if (align === 'center') {
        return (
          Math.abs((nd.abX + nd.abXops - (pd.abX + pd.abXops)) / 2) <
          ErrorCoefficient
        );
      } else if (align === 'left') {
        return Math.abs((nd.abX - pd.abX) / 2) < ErrorCoefficient;
      }
    }) &&
    result
  );
}
function isJustifyAround(nodes: any, parent: any) {
  // 左右间距判断
  let firstNode = nodes[0];
  let lastNode = nodes[nodes.length - 1];
  let leftSide = (firstNode.abX + firstNode.abXops) / 2 - parent.abX;
  let rightSide = parent.abXops - (lastNode.abX + lastNode.abXops) / 2;
  return Math.abs(leftSide - rightSide) < ErrorCoefficient;
}
function isAllCanFlex(nodes: any) {
  return nodes.every((node: any) => {
    return (
      node.canLeftFlex !== false &&
      node.canRightFlex !== false &&
      node.constraints.LayoutFixedWidth !== Constraints.LayoutFixedWidth.Fixed
    );
  });
}
//  调整居中模型位置
function adjustCenterPos(nodes: any, width: any, prevLineCenterPos: any) {
  nodes.forEach((_nd: any, i: number) => {
    let nd: any = _nd;
    let ndWidth = nd.abXops - nd.abX;
    let dir = Math.floor((width - ndWidth) / 2);
    let abX = prevLineCenterPos ? prevLineCenterPos[i].abX : nd.abX - dir;
    let abXops = prevLineCenterPos
      ? prevLineCenterPos[i].abXops
      : nd.abXops + dir;
    nd.abX = abX;
    nd.abXops = abXops;
    // 设置居中
    nd.constraints.LayoutJustifyContent =
      Constraints.LayoutJustifyContent.Center;
    nd.constraints.LayoutFixedWidth = Constraints.LayoutFixedWidth.Fixed;
    nd.constraints = nd.constraints;
  });
}
//  调整居中模型位置
function adjustLeftPos(nodes: any, width: any) {
  nodes.forEach((_nd: any) => {
    let nd: any = _nd;
    nd.abXops = nd.abX + width;
    // 设置居中
    nd.constraints.LayoutJustifyContent =
      Constraints.LayoutJustifyContent.Start;
    nd.constraints.LayoutFixedWidth = Constraints.LayoutFixedWidth.Fixed;
    nd.constraints = nd.constraints;
  });
}
function isSameSimilarId(nodes: any) {
  let similarId: number | null;

  return (
    nodes.length > 1 &&
    nodes.every((nd: any) => {
      let isSameModel = similarId == null || nd.similarId == similarId;
      similarId = nd.similarId;
      return isSameModel;
    })
  );
}

function isAllSameModel(nodes: any) {
  let modelType: any;

  return (
    nodes.length > 1 &&
    nodes.every((nd: any) => {
      let isSameModel = !modelType || nd.constructor == modelType;
      modelType = nd.constructor;
      return isSameModel;
    })
  );
}

function isEqualitySide(nodes: any, parent: any) {
  let firstNode = nodes[0];
  let lastNode = nodes[nodes.length - 1];
  let left = firstNode.abX - parent.abX;
  let right = parent.abXops - lastNode.abXops;
  let isEq = Math.abs(left - right) < 4;

  return (
    isEq &&
    Math.min(
      left + (firstNode.abXops - firstNode.abX) / 2,
      right + (lastNode.abXops - lastNode.abX) / 2,
    )
  );
}

function inRange(nodes: any, width: number, align: number = 0) {
  return nodes.every((node: any, i: number) => {
    if (!nodes[i + 1]) {
      return true;
    }
    if (align === 0) {
      // 左对齐
      return node.abX + width <= nodes[i + 1].abX;
    } else if (align === 1) {
      // 居中
      return (node.abX + node.abXops + width) / 2 <= nodes[i + 1].abX;
    }
  });
}
function isContain(nodes: any, width: number) {
  return nodes.every((node: any) => node.abXops - node.abX <= width);
}

/**
 * 左对齐等分要求
 * 节点间距相等
 */
function isEqualityLeft(nodes: any, parent: any) {
  // 左右间距判断
  let firstNode = nodes[0];
  let lastNode = nodes[nodes.length - 1];
  let leftSide = firstNode.abX - parent.abX;
  let rightSide = leftSide;
  // 左边界数组
  let dirArr: any = [];
  // 计算左间距
  nodes.forEach((node: any, i: any) => {
    let prev = nodes[i - 1];
    if (prev) {
      let dir = node.abX - prev.abX;
      dirArr.push(dir);
    }
  });

  dirArr.sort((a: number, b: number) => a - b);
  // 假设最大宽度为元素左边距的距离
  let minDir = dirArr[0];
  let maxDir = dirArr[dirArr.length - 1];
  // 如果最大和最小间距差大于系数，则不符合
  if (Math.abs(maxDir - minDir) > ErrorCoefficient) {
    return false;
  }
  let targetWidth = minDir;
  let _isContain = isContain(nodes, targetWidth);
  // 如果目标宽度小于部分节点宽度
  if (!_isContain) {
    return false;
  }

  let lastNodeAbXops = lastNode.abX + targetWidth;
  let paddingRightAbX = parent.abXops - rightSide;
  // 如果末节点原右边界未超出父节点范围，末节点新右边界超出父节点范围，不符合左等分
  if (lastNode.abXops < parent.abXops && lastNodeAbXops > parent.abXops) {
    return false;
  }

  //  如果末节点的右边界在父节点的padding-right内，则裁剪“假设宽度”targetWidth
  if (lastNodeAbXops <= parent.abXops && lastNodeAbXops > paddingRightAbX) {
    let shrinkWidth = targetWidth - (lastNodeAbXops - paddingRightAbX);
    // 验证新节点都包含原节点范围
    let _isContain2 = isContain(nodes, shrinkWidth);
    if (_isContain2) {
      targetWidth = shrinkWidth;
    }
  }
  return targetWidth;
}

/**
 * 中心点等分要求
 * 左右边距相等，节点间距相等
 */
function isEqualityCenter(nodes: any, parent: any, isCenter: boolean) {
  // 左右间距判断
  let firstNode = nodes[0],
    lastNode = nodes[nodes.length - 1];
  // 如果父节点居中，左边界不限制
  let allowAbX = isCenter ? Number.NEGATIVE_INFINITY : parent.abX,
    // 逻辑，如果父节点是居中\超界，右边界不限制
    allowAbXops =
      isCenter || parent.abXops >= designWidth
        ? Number.POSITIVE_INFINITY
        : parent.abXops;
  let leftSide = firstNode.abX - allowAbX + firstNode.width / 2,
    rightSize = allowAbXops - lastNode.abXops + lastNode.width / 2;
  let maxWidth = 0;

  // 中心点数组
  let dirArr: any = [];
  // 得出间距数组
  nodes.some((nd: any, i: any) => {
    let prev = nodes[i - 1];
    maxWidth = nd.width > maxWidth ? nd.width : maxWidth;
    if (prev) {
      let dir = (nd.abX + nd.abXops) / 2 - (prev.abX + prev.abXops) / 2;
      dirArr.push(dir);
    }
  });
  dirArr.sort((a: number, b: number) => a - b);
  let minDir = dirArr[0];
  let maxDir = dirArr[dirArr.length - 1];
  if (
    // 如果最大和最小间距差大于系数，
    Math.abs(minDir - maxDir) > ErrorCoefficient
  ) {
    return false;
  }

  /**
   * 如果符合间距等宽要求，计算合适间距  */

  // 获取目标宽度
  let maybeDir = Math.min(leftSide * 2, rightSize * 2, minDir);
  if (maybeDir < maxWidth) {
    return false;
  }

  return maybeDir;
}
/**
 * 对传进来的模型数组进行处理
 * @param {TreeNode} parent 树节点
 * @param {Array} nodes 树节点数组
 * @param {Array} models 对应的模型数组
 */
export default function(parent: any, nodes: any) {
  if (parent.type === Dictionary.type.QText) {
    return;
  }
  // 剔除绝对定位元素
  let flexNodes = Utils.filterAbsNode(nodes);
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
  let _isAllCanFlex = isAllCanFlex(flexNodes);
  // 如果子节点类型不一样，则返回
  let _isSameSimilarId = isSameSimilarId(flexNodes);
  if (!_isAllCanFlex || !_isSameSimilarId) {
    return;
  }
  // 判断当前行是否居中等分
  let curLineIsJustifyAround = isJustifyAround(flexNodes, parent);
  // 计算左对齐等分结果
  let leftSpace = isEqualityLeft(flexNodes, parent);
  // 计算中对齐等分结果
  let centerSpace = isEqualityCenter(flexNodes, parent, curLineIsJustifyAround);
  // 计算两端对齐结果
  let aroundArr = isAround(flexNodes);
  /**
   * 其他衡量依据
   */
  // 判断上下行内容是否中对齐等分
  let prevLineIsJustifyCenter =
    centerSpace && calLineIsJustify(flexNodes, parent, -1, 'center');
  let nextLineIsJustifyCenter =
    centerSpace && calLineIsJustify(flexNodes, parent, 1, 'center');
  // 判断上下行内容是否左对齐等分
  let prevLineIsJustifyLeft =
    leftSpace && calLineIsJustify(flexNodes, parent, -1, 'left');
  let nextLineIsJustifyLeft =
    leftSpace && calLineIsJustify(flexNodes, parent, 1, 'left');
  if (
    // 如果有中心间距相等，并且内容居中/与上一行对齐/与下一行对齐
    centerSpace &&
    (!nextLineIsJustifyLeft && !prevLineIsJustifyLeft) &&
    (curLineIsJustifyAround ||
      prevLineIsJustifyCenter ||
      nextLineIsJustifyCenter)
  ) {
    // if (
    //     // 如果有中心间距，并且居中|与上一行对齐|与下一行对齐
    //     centerSpace &&
    //     (prevLineIsJustifyCenter || nextLineIsJustifyCenter)
    // ) {
    adjustCenterPos(flexNodes, centerSpace, prevLineIsJustifyCenter);
    parent.resize();
    parent.constraints.LayoutJustifyContent =
      Constraints.LayoutJustifyContent.Center;
  } else if (aroundArr) {
    // 两端对齐
    adjustAround(flexNodes);
    parent.constraints.LayoutJustifyContent =
      Constraints.LayoutJustifyContent.Center;
  } else if (leftSpace) {
    adjustLeftPos(flexNodes, leftSpace);
    parent.constraints.LayoutJustifyContent =
      Constraints.LayoutJustifyContent.Start;
  }
}
