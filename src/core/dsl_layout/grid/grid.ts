import Utils from '../helper/methods';
import Constraints from '../helper/constraints';
import Dictionary from '../helper/dictionary';
import Dividing from '../../dsl_render/h5/models/dividing/model';
import LayerModel from '../../dsl_model/models/layer';
import Inline from '../../dsl_render/h5/widgets/inline/widget';
/**
 * DSL树的构建类,用于生成和输出标准数据
 */

function _row(parent: any) {
  let { children } = parent;
  // 如果只有一个子节点，则不生成新组
  if (children.length <= 1) {
    // 当只包含一个元素时就不用创建QLayer
    return;
  }
  // 分解行
  let layers = Utils.gatherByLogic(children, (a: any, b: any) => {
    if (
      a.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute &&
      b.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute &&
      Utils.isYConnect(a, b, -1)
    ) {
      if (
        // 如果a节点层级高于b，且a节点位置高于b，且水平相连，则为一组（a为绝对定位，如红点）
        (Utils.isXConnect(a, b, -1) &&
          (a.abY < b.abY && a.zIndex < b.zIndex)) ||
        (a.abY > b.abY && a.zIndex > b.zIndex)
      ) {
        return false;
      }
      return true;
    }
    return false;
  });
  // 如果只有一组，则不生产新组
  if (layers.length === 1) {
    return;
  }
  // 计算边界
  layers.forEach((l: any) => {
    let range = Utils.calRange(
      l.filter(
        (n: any) =>
          n.constraints &&
          n.constraints.LayoutSelfPosition !==
            Constraints.LayoutSelfPosition.Absolute,
      ),
    );
    Object.assign(l, range);
  });

  const newChildren: any = [];
  layers.forEach((arr: any) => {
    let firstNode = arr[0];
    /**
     * 当横向节点只有一个，且
     * 该节点是绝对定位元素，
     * 或节点非文本
     * 或节点与父节点等宽，
     * 则不包一层
     */
    if (
      arr.length === 1 &&
      (firstNode.constraints['LayoutSelfPosition'] ===
        Constraints.LayoutSelfPosition.Absolute ||
        firstNode instanceof Dividing)
      // ||
      // (firstNode.type !== Dictionary.type.QText &&
      //   firstNode.abX === parent.abX &&
      //   firstNode.abXops === parent.abXops)
      // || firstNode instanceof Dividing
    ) {
      newChildren.push(firstNode);
    } else {
      // 多个节点情况
      // 自左而右排序
      arr.sort((a: any, b: any) => a.abX - b.abX);

      let node: any = new LayerModel({
        parent,
        abX: parent.abX,
        abY: arr.abY,
        abXops: parent.abXops,
        abYops: arr.abYops,
      });

      arr.forEach((child: any) => {
        child.parent = node;
        node.children = node.children.concat(child);
        // 新增节点，重置层级关系
        node.resetZIndex();
      });
      newChildren.push(node);
    }
  });

  // 替换原来的结构
  parent.children = newChildren;
}

function _column(parent: any) {
  const { children } = parent;
  // 如果只有一个子节点，则不生成新组
  if (children.length <= 1) {
    // 当只包含一个元素时就不用创建QLayer
    return;
  }

  // 分解列
  const layers = Utils.gatherByLogic(children, (a: any, b: any) => {
    return (
      a.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute &&
      b.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute &&
      Utils.isXConnect(a, b)
    );
  });
  // 如果只有一列，则不生成新组
  if (layers.length === 1) {
    return;
  }
  // 计算边界
  layers.forEach((l: any) => {
    const range = Utils.calRange(
      l.filter(
        (n: any) =>
          n.constraints &&
          n.constraints.LayoutSelfPosition !==
            Constraints.LayoutSelfPosition.Absolute,
      ),
    );
    Object.assign(l, range);
  });
  // 自左向右排序
  layers.sort((a: any, b: any) => a.abX - b.abX);
  const newChildren: any = [];
  layers.forEach((arr: any) => {
    const firstNode = arr[0];
    /**
     * 当列拆分只有一个节点，
     * 且该节点不是文本：文本外须包布局节点
     * 且该节点是绝对定位的
     */
    if (
      arr.length === 1 &&
      (firstNode instanceof Dividing ||
        firstNode.type === Dictionary.type.QLayer ||
        firstNode.constraints['LayoutSelfPosition'] ===
          Constraints.LayoutSelfPosition.Absolute)
    ) {
      // 当纵向节点只有一个时
      newChildren.push(firstNode);
    } else {
      // 多个节点情况
      // 自上而下排序
      arr.sort((a: any, b: any) => a.abY - b.abY);
      const node = new LayerModel({
        parent: parent,
        abX: arr.abX,
        abY: arr.abY,
        abXops: arr.abXops,
        abYops: arr.abYops,
      });

      arr.forEach((child: any) => {
        child.parent = node;
        node.children = node.children.concat(child);
        node.resetZIndex();
      });
      newChildren.push(node);
    }
  });

  // 替换原来的结构
  parent.children = newChildren;
}

/**
 * 对节点进行成组排版
 */
function grid(_treeData: any) {
  if (_treeData.type !== Dictionary.type.QText) {
    _row(_treeData);
    _column(_treeData);
    // 从里面到外进行组合分析
    const { children } = _treeData;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.children !== 0) {
        // 继续进入下一层
        grid(child);
      }
    }
  }
  return _treeData;
}
export default grid;
