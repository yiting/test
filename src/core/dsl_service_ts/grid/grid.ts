import Utils from '../helper/methods';
import Constraints from '../helper/constraints';
import Dictionary from '../helper/dictionary';
import Dividing from '../model/modelList/dividing';
import LayerModel from '../model/modelList/layer';
/**
 * DSL树的构建类,用于生成和输出标准数据
 */

export function _row(parent: any) {
  const { children } = parent;
  // 如果只有一个子节点，则不生成新组
  if (children.length <= 1) {
    // 当只包含一个元素时就不用创建QLayer
    return;
  }

  // 分解行
  const layers = Utils.gatherByLogic(children, (a: any, b: any) => {
    // 如果a节点层级高于b，且a节点位置高于b，且水平相连，则为一组（a为绝对定位，如红点）
    /* if (a._abY < b._abY && a._zIndex > b._zIndex) {
                // 使用-1是因为避免相连元素为一组
                return Utils.isYConnect(a, b, -1);
              }
              return Utils.isYWrap(a, b); */
    if (Utils.isYConnect(a, b, -1)) {
      if (
        // 如果a节点层级高于b，且a节点位置高于b，且水平相连，则为一组（a为绝对定位，如红点）
        (Utils.isXConnect(a, b, -1) &&
          (a._abY < b._abY && a._zIndex < b._zIndex)) ||
        (a._abY > b._abY && a._zIndex > b._zIndex)
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

  const newChildren: any = [];
  layers.forEach((arr: any) => {
    const firstNode = arr[0];
    /**
     * 删除：如果是单个文本，则须在文本外包布局节点
     */
    // if (arr.length === 1 && arr[0].type !== Common.QText) {
    /**
     * 删除：当横向节点只有一个时
     */
    // if (arr.length === 1) {
    /**
     * 当横向节点只有一个，
     * 且该节点不是绝对定位元素，
     * 且该节点不是不与父节点等宽
     */
    if (
      arr.length === 1 &&
      (firstNode.constraints['LayoutSelfPosition'] ===
        Constraints.LayoutSelfPosition.Absolute ||
        (firstNode.type !== Dictionary.type.QText &&
          firstNode.abX === parent.abX &&
          firstNode.abXops === parent.abXops))
      // || firstNode instanceof Dividing
    ) {
      newChildren.push(firstNode);
    } else {
      // // 判断是否横跨两行结构
      // const { absNodes, rowNodes, colNodes } = calColumn(arr);
      // absNodes.forEach((nd: any) => {
      //   nd.constraints.LayoutSelfPosition = Constraints.LayoutSelfPosition.Absolute;
      // });

      // 多个节点情况
      // 自左而右排序
      arr.sort((a: any, b: any) => a.abX - b.abX);

      const node = new LayerModel({
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

export function _column(parent: any) {
  const { children } = parent;
  // 如果只有一个子节点，则不生成新组
  if (children.length <= 1) {
    // 当只包含一个元素时就不用创建QLayer
    return;
  }

  // 分解列
  const layers = Utils.gatherByLogic(children, (a: any, b: any) =>
    Utils.isXConnect(a, b),
  );
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
  const everyArrOnlyOneChild = layers.every((arr: any) => arr.length === 1);
  layers.forEach((arr: any) => {
    const firstNode = arr[0];
    /**
     *
     */
    // if (arr.length === 1 && arr[0].type !== Common.QText) {
    /**
     * 删除：当横向节点只有一个时
     */
    // if (arr.length === 1) {
    /**
     * 当列拆分只有一个节点，
     * 且该节点不是文本：文本外须包布局节点
     * 且该节点是绝对定位的
     */
    if (
      arr.length === 1 &&
      (firstNode.type === Dictionary.type.QLayer ||
        /* 
        // 移除原因：如果图形大小不一致，但布局等分，影响计算逻辑
        (firstNode.type === Dictionary.type.QImage && everyArrOnlyOneChild) || */
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
  return _treeData;
}
export default grid;
