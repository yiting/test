// 绝对定位布局模型处理
import Utils from '../../../dsl_helper/methods';
// import Model from '../model';
import * as Constrains from '../../../dsl_helper/constraints';
import Store from '../../../dsl_helper/store';
import Dictionary from '../../../dsl_helper/dictionary';

// flex layout 的处理核心是
//
// 只有一个元素: 竖排
// 多于一个元素
// 竖排: 竖排的处理逻辑是子节点在y轴并不相交
// 横排: 非竖排的情况
//
// 横排的时候对QWidget, QImage, QText的处理逻辑为:
// （可继续优化, 基于对模型分析）
// 1: 如果
// s2: 其余的以绝对定位

let ErrorCoefficient: number = 0;
function isAbsolute(parent: any, node: any) {
  if (!parent.parentId) {
    // 如果为跟节点对子元素，超边界也为非绝对定位
    return false;
  }
  // 如果子节点超出上下边界，则为绝对定位
  if (
    node.constraints.LayoutPosition === Constrains.LayoutPosition.Absolute ||
    node.abY < parent.abY ||
    // node.abX < parent.abX ||
    node.abYops > parent.abYops
    // node.abXops > parent.abXops
  ) {
    return true;
  }
  return false;
}

/**
 * 对子元素进行竖排处理
 * @param {Node} parent
 * @param {Array} nodes
 * @param {Array} models
 */
function handleVertical(_parent: any, _calNodes: any, _absNodes: any) {
  const parent: any = _parent;
  const calNodes: any = _calNodes;
  const absNodes: any = _absNodes;

  for (let i = 0; i < calNodes.length; i++) {
    const nd = calNodes[i];
    // let prev = calNodes[i - 1];
    const prev = getPrev(calNodes, nd);
    if (prev && Utils.isYWrap(prev, nd)) {
      // 重叠逻辑： 如果在Y轴上完全重合，则前点(层级高或面积小的）为绝对定位
      absNodes.push(prev.zIndex > nd.zIndex ? prev : nd);
    } else if (
      prev &&
      Utils.isYConnect(prev, nd, -4) &&
      (prev.zIndex > nd.zIndex ||
        prev.width * prev.height < nd.width * nd.height)
    ) {
      // 重叠逻辑：如果部分重叠，且前（上）节点层级高，则为绝对定位
      absNodes.push(prev);
    }
  }
}
/**
 * 对子元素进行横排处理
 * @param {Node} parent
 * @param {Array} nodes
 * @param {Array} models
 */
function handleHorizontal(_parent: any, _calNodes: any, _absNodes: any) {
  const parent: any = _parent;
  const calNodes: any = _calNodes;
  if (calNodes.length < 3) {
    return;
  }
  const absNodes: any = _absNodes;
  parent.constraints.LayoutDirection = Constrains.LayoutDirection.Horizontal;

  // const top = parent.abY;
  // const bottom = parent.abYops;
  // const middle = (parent.abY + parent.abYops) / 2;
  let topArr: any = [];
  let bottomArr: any = [];
  let middleArr: any = [];
  calNodes.forEach((nd: any) => {
    topArr.push(nd);
    bottomArr.push(nd);
    middleArr.push(nd);
  });
  topArr.sort((a: any, b: any) => b.abY - a.abY);
  middleArr.sort((a: any, b: any) => b.abYops + b.abY - a.abYops - a.abY);
  bottomArr.sort((a: any, b: any) => b.abYops - a.abYops);

  topArr = topArr.filter((n: any) => topArr[0].abY - n.abY <= ErrorCoefficient);
  middleArr = middleArr.filter(
    (n: any) =>
      (middleArr[0].abY + middleArr[0].abYops - n.abY - n.abYops) / 2 <=
      ErrorCoefficient,
  );
  bottomArr = bottomArr.filter(
    (n: any) => bottomArr[0].abYops - n.abYops <= ErrorCoefficient,
  );

  // 获得最多相同基线的节点
  let maxArr = [topArr, bottomArr, middleArr].sort(
    (a, b) => b.length - a.length,
  )[0];

  // 赋予副轴约束
  if (maxArr.length === 1) {
    // 如果最大基线元素只有一个，则选面积最大的
    maxArr = [
      calNodes
        .slice()
        .sort((a: any, b: any) => b.width * b.height - a.width * a.height)[0],
    ];
  } else if (maxArr === topArr) {
    parent.constraints.LayoutAlignItems = Constrains.LayoutAlignItems.Start;
  } else if (maxArr === middleArr) {
    parent.constraints.LayoutAlignItems = Constrains.LayoutAlignItems.Center;
  } else if (maxArr === bottomArr) {
    parent.constraints.LayoutAlignItems = Constrains.LayoutAlignItems.End;
  }
  // 赋予非轴线节点为绝对定位
  calNodes.forEach((nd: any) => {
    if (!maxArr.includes(nd)) {
      absNodes.push(nd);
    }
  });
}
/**
 * 对子元素进行绝对定位处理
 * @param {Node} parent
 * @param {Array} nodes
 * @param {Array} models
 */
function handleAbsolute(_parent: any, _calNodes: any, _absNodes: any) {
  const parent: any = _parent;
  const calNodes: any = _calNodes;
  const absNodes: any = _absNodes;
  // 横向的排列原则先简单按照:
  const distArr: any = [];
  calNodes.forEach((nd: any, index: number) => {
    const prev: any = calNodes[index - 1];
    const dist = nd.abX - (prev ? prev.abXops : parent.abX);
    const left = nd.abX - parent.abX;
    const right = parent.abXops - nd.abXops;
    distArr.push({ index, dist, left, right });
  });
  const lastNode: any = calNodes[calNodes.length - 1];
  distArr.push({
    index: calNodes.length,
    dist: parent.abXops - lastNode.abXops,
    left: lastNode.abXops,
    right: parent.abXops - lastNode.abXops,
  });

  if (distArr.length > 0) {
    distArr.sort((a: any, b: any) => {
      return b.dist - a.dist;
    });
    const dist1 = distArr[0];
    const dist2 = distArr[1];
    let startIndex, endIndex, isDirLeft;
    /**
     * 如果最大间距比其他间距大，
     * 且不是最左/最右的空隙
     * 则符合条件
     * */
    if (
      dist1.dist &&
      dist2.dist &&
      dist1.dist > ErrorCoefficient &&
      dist2.dist > ErrorCoefficient &&
      dist1.dist / dist2.dist > 1.5 &&
      dist1.index !== 0 &&
      dist1.index !== calNodes.length
    ) {
      if (dist1.left > dist1.right) {
        // 左堆比右堆大，左堆为主堆
        startIndex = dist1.index;
        endIndex = calNodes.length;
        isDirLeft = false;
      } else {
        startIndex = 0;
        endIndex = dist1.index;
        isDirLeft = true;
      }
      for (let i = startIndex; i < endIndex; i++) {
        const absNode = calNodes[i];
        absNodes.push(absNode);
        setDirection(absNode, isDirLeft);
      }
    }
  }
}

// 筛选前排序
function sort(nodes: any, opt: any) {
  nodes.sort((a: any, b: any) => a[opt] - b[opt]);
}

function getPrev(nodes: any, node: any): any {
  let prev = null;
  nodes.some((nd: any) => {
    if (nd === node) {
      return true;
    }
    prev = nd;
    return false;
  });
  return prev;
}

function setAbsolute(_node: any) {
  const node: any = _node;
  node.constraints.LayoutPosition = Constrains.LayoutPosition.Absolute;
  if (!node.constraints.LayoutFixedWidth) {
    node.constraints.LayoutFixedWidth = Constrains.LayoutFixedWidth.Fixed;
  }
  if (!node.constraints.LayoutFixedHeight) {
    node.constraints.LayoutFixedHeight = Constrains.LayoutFixedHeight.Fixed;
  }
}

function setDirection(_node: any, _isDirLeft: boolean) {
  const node: any = _node;
  if (_isDirLeft) {
    node.constraints.LayoutSelfHorizontal =
      Constrains.LayoutSelfHorizontal.Left;
  } else {
    node.constraints.LayoutSelfHorizontal =
      Constrains.LayoutSelfHorizontal.Right;
  }
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
  ErrorCoefficient = Store.get('errorCoefficient') || 0;
  // 剔除绝对定位节点
  const absNodes: any = [];
  const calNodes: any = [];
  // 遍历所有绝对布局
  nodes.forEach((nd: any) => {
    if (isAbsolute(parent, nd)) {
      absNodes.push(nd);
    } else {
      calNodes.push(nd);
    }
  });
  // 当可计算元素大于1个，进入布局逻辑
  if (calNodes.length > 1) {
    if (Utils.isHorizontal(calNodes)) {
      parent.constraints.LayoutDirection =
        Constrains.LayoutDirection.Horizontal;
      sort(calNodes, 'abX');
      handleAbsolute(parent, calNodes, absNodes);
      const newCalNodes = calNodes.filter(
        (node: any) => !absNodes.includes(node),
      );
      // 横排基线普查，标识所有不在基线的元素为绝对定位
      handleHorizontal(parent, newCalNodes, absNodes);
    } else {
      parent.constraints.LayoutDirection = Constrains.LayoutDirection.Vertical;
      sort(calNodes, 'abY');
      // 竖排基线普查，标识所有不在基线的元素为绝对定位
      handleVertical(parent, calNodes, absNodes);
    }
  }
  absNodes.forEach((nd: any) => {
    setAbsolute(nd);
  });
}
