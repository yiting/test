// Flex布局模型处理
import Common from '../common';
import Utils from '../utils';
import Model from '../model';
import Constrains from '../constraints';

// flex layout 的处理核心是
//
// 只有一个元素: 竖排
// 多于一个元素
// 竖排: 竖排的处理逻辑是子节点在y轴并不相交
// 横排: 非竖排的情况
//
// 横排的时候对QWidget, QImage, QText, QIcon, QShape的处理逻辑为:
// （可继续优化, 基于对模型分析）
// 1: 如果
// s2: 其余的以绝对定位

class LayoutFlex extends Model.LayoutModel {
  /* constructor(modelType: any) {
    super(modelType);
  } */

  /**
   * 对传进来的模型数组进行处理
   * @param {TreeNode} parent 树节点
   * @param {Array} nodes 树节点数组
   * @param {Array} models 对应的模型数组
   * @param {Int} layoutType 布局的类型
   */
  handle(parent: any, nodes: any) {
    const that: any = this;
    // 剔除绝对定位节点
    const absNodes: any = [];
    const calNodes: any = [];
    // 遍历所有绝对布局
    nodes.forEach((nd: any) => {
      if (LayoutFlex._handleAbsolute(parent, nd)) {
        nd.set('isCalculate', true);
        absNodes.push(nd);
      } else {
        calNodes.push(nd);
      }
    });
    // 当可计算元素大于1个，进入布局逻辑

    if (calNodes.length > 1) {
      if (Utils.isHorizontal(calNodes)) {
        LayoutFlex._sort(calNodes, 'abX');
        // 横排基线普查，标识所有不在基线的元素为绝对定位
        LayoutFlex._handleHorizontal(parent, calNodes, absNodes);
      } else {
        LayoutFlex._sort(calNodes, 'abY');
        // 竖排基线普查，标识所有不在基线的元素为绝对定位
        LayoutFlex._handleVertical(parent, calNodes, absNodes);
      }
    }
    absNodes.forEach((nd: any) => {
      LayoutFlex._setAbsolute(nd);
    });
  }

  // 如果子节点超出边界，则为绝对定位
  static _handleAbsolute(parent: any, node: any) {
    if (!parent.parentId) {
      // 如果为跟节点对子元素，超边界也为非绝对定位
      return false;
    }
    if (
      node.constraints.LayoutSelfPosition ===
        Constrains.LayoutSelfPosition.Absolute ||
      node.abY < parent.abY ||
      node.abX < parent.abX ||
      node.abYops > parent.abYops ||
      node.abXops > parent.abXops
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
  static _handleVertical(_parent: any, _calNodes: any, _absNodes: any) {
    const parent: any = _parent;
    const calNodes: any = _calNodes;
    const absNodes: any = _absNodes;
    parent.constraints.LayoutDirection = Constrains.LayoutDirection.Vertical;

    for (let i = 0; i < calNodes.length; i++) {
      const nd = calNodes[i];
      // let prev = calNodes[i - 1];
      const prev = LayoutFlex._getPrev(calNodes, nd);
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
    // 赋予非轴线节点为绝对定位
    /* for (let i = 0; i < calNodes.length; i++) {
            let nd = calNodes[i];
            nd.set('isCalculate', true);    // 约束计算完成
            if (absNodes.includes(nd)) {
                LayoutFlex._setAbsolute(nd);
            } else {
                if (nd.canLeftFlex) {
                    nd.set("abX", parent.abX);
                }

                if (nd.canRightFlex) {
                    nd.set("abXops", parent.abXops);
                }
            }
        }; */
    if (absNodes.length > 0) {
      // 父节点赋予相对定位约束
      parent.constraints.LayoutPosition = Constrains.LayoutPosition.Absolute;
    }
  }

  /**
   * 对子元素进行横排处理
   * @param {Node} parent
   * @param {Array} nodes
   * @param {Array} models
   */
  static _handleHorizontal(_parent: any, _calNodes: any, _absNodes: any) {
    const parent: any = _parent;
    const calNodes: any = _calNodes;
    const absNodes: any = _absNodes;
    parent.constraints.LayoutDirection = Constrains.LayoutDirection.Horizontal;
    // parent.constraints['LayoutJustifyContent'] = Constrains.LayoutJustifyContent.Start;
    // 横向的排列原则先简单按照:
    // 1, 从左往右,从上往下排列
    // 2, 从最左开始计算出x轴上不相交的元素组成横向一排
    // 3, 没能排列的元素, 若与某元素相交, 则包含进相交元素, 否则加到parent处

    const top = parent.abY;
    const bottom = parent.abYops;
    const middle = (parent.abY + parent.abYops) / 2;
    const topArr: any = [];
    const bottomArr: any = [];
    const middleArr: any = [];
    calNodes.forEach((nd: any) => {
      if (Math.abs(nd.abY - top) < 3) {
        topArr.push(nd);
      }
      if (Math.abs(nd.abYops - bottom) < 3) {
        bottomArr.push(nd);
      }
      if (Math.abs((nd.abYops + nd.abY) / 2 - middle) < 3) {
        middleArr.push(nd);
      }
    });
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
        nd.set('isCalculate', true); // 约束计算完成
      }
    });
    if (absNodes.length > 0) {
      parent.constraints.LayoutPosition = Constrains.LayoutPosition.Absolute;
    }
  }

  // 筛选前排序
  static _sort(nodes: any, opt: any) {
    nodes.sort((a: any, b: any) => a[opt] - b[opt]);
  }

  static _getPrev(nodes: any, node: any): any {
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

  static _setAbsolute(_node: any) {
    const node: any = _node;
    node.constraints.LayoutSelfPosition =
      Constrains.LayoutSelfPosition.Absolute;
    if (!node.constraints.LayoutFixedWidth) {
      node.constraints.LayoutFixedWidth = Constrains.LayoutFixedWidth.Fixed;
    }
    if (!node.constraints.LayoutFixedHeight) {
      node.constraints.LayoutFixedHeight = Constrains.LayoutFixedHeight.Fixed;
    }
  }
}

export default LayoutFlex;
