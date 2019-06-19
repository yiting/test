const Logger = require('../logger');
const { QDocument, QLayer, QImage, QText, QShape, QMask } = require('../nodes');
const { serialize, walkin, walkout, isBelong, isCollide } = require('../utils');
function process(node) {
  try {
    // 树层级关系预处理
    StructureProcessor.clear(node); // 清洗元素
    StructureProcessor.justify(node); // 调整层级
  } catch (err) {
    Logger.error('结构优化报错！');
  }
}
// 树结构预处理  先清洗被覆盖的节点，再根据视觉嵌套关系层级调整
class StructureProcessor {
  static _getTargetList(node) {
    // 候选父节点集合
    const arr = [];
    walkin(node, parent => {
      if (!parent.children || !parent.children.length) return;
      if (parent.hasComplexSytle) return; // 包含影响子元素的属性：opacity,transform的节点不参与
      arr.push(parent);
    });
    // 根元素不参与调整
    return arr;
  }

  // 获取视觉面积最小的嵌套节点
  static _getVisualParent(node, arr) {
    const parentList = arr.filter(
      parent =>
        node !== parent &&
        isBelong(node, parent) &&
        node.width * node.height !== parent.width * parent.height,
    ); // 重叠不参与
    if (!parentList.length) return null;
    if (parentList.length === 1) return parentList[0];
    const minSize = Math.min(
      ...parentList.map(({ width, height }) => width * height),
    );
    const minParentList = parentList.filter(
      ({ width, height }) => width * height === minSize,
    );
    if (minParentList.length === 1) return minParentList[0];
    // 面积最小父节点只有一个，则返回
    return minParentList.pop(); // TODO 候选父节点策略待定
  }

  static clear(node) {
    // 清理被覆盖的节点
    let nodelist = serialize(node);
    walkin(node, parent => {
      if (!parent.children || !parent.children.length) return;
      [...parent.children].forEach(child => {
        const res =
          this.isEmtyGroup(child) ||
          this.isTransparentStyle(child) ||
          this.isOutside(child, nodelist[0]) ||
          this.isCovered(child, nodelist) ||
          this.isCamouflage(child, nodelist);
        if (res) {
          parent.isModified = true;
          parent.remove(child);
          console.log(child.name + '被清理');
          nodelist = serialize(node);
        }
      });
    });
  }

  static justify(node) {
    // 根据嵌套关系调整层级结构
    const _arr = this._getTargetList(node);
    const operateList = [];
    const nodelist = serialize(node);
    walkout(node, n => {
      if (!n.parent) return;
      const { parent } = n;
      const visual_parent = this._getVisualParent(n, _arr); // 获取视觉面积最小的嵌套节点
      if (
        visual_parent &&
        parent.id !== visual_parent.id &&
        parent.width * parent.height >
          visual_parent.width * visual_parent.height
      ) {
        // 如果候选父节点不是原先父节点，而且面积还小于原先父节点
        // 组复制
        // Skbase.action.moveLayer(node,visual_parent);
        // 移动节点
        operateList.push({
          target: n,
          visual_parent,
        });
      }
    });
    operateList.forEach(({ visual_parent, target }) => {
      const { parent } = target;
      const index =
        nodelist.indexOf(target) > nodelist.indexOf(visual_parent)
          ? visual_parent.children.length
          : 0;
      parent.remove(target);
      visual_parent.add(target, index);
      parent.isModified = visual_parent.isModified = true;
      console.log(target.name, '从', parent.name, '移动到', visual_parent.name);
    });
  }

  static isTransparentStyle(node) {
    let { background, border } = node.styles;
    return (
      !node.childNum &&
      (node.isTransparent ||
        (background &&
          background.hasOpacity &&
          background.type === 'color' &&
          +background.color.a === 0) ||
        (border && +border.color.a === 0))
    );
  }

  // 节点是否被覆盖
  static isCovered(node, nodelist) {
    const index = nodelist.indexOf(node);
    const arr2 = nodelist.slice(index + 1).filter(n => {
      const parentList = n.getParentList();
      return !~parentList.indexOf(node);
    }); // 越往后节点的z-index越大
    return arr2.some(
      brother =>
        brother.type !== QLayer.name &&
        isBelong(node, brother) &&
        !brother.hasComplexStyle,
    ); // 如果节点被兄弟覆盖，并且自己没有其它属性（shadow）影响到兄弟，则移除该节点
    // const res = arr2.find(brother => is_A_belong_B(node,brother) && !hasComplexSytle(brother)); // 如果节点被兄弟覆盖，并且自己没有其它属性（shadow）影响到兄弟，则移除该节点
    // if(res) {
    //     _document.removeNode(node.id);
    //     console.log(node.name + '被清理，因为被' + res.name + '覆盖了。');
    // }
  }

  // 节点颜色是否与背景同色
  static isCamouflage(node, nodelist) {
    const { pureColor } = node;
    if (!pureColor) return false;
    const node_index = nodelist.indexOf(node);
    const bgNode = nodelist
      .slice(0, node_index)
      .reverse()
      .find(
        n =>
          isSameColor(pureColor, n.pureColor) &&
          (n.isRoot || isBelong(node, n)),
      );
    if (!bgNode) return false;
    const bgNode_index = nodelist.indexOf(bgNode);
    if (bgNode_index + 1 < node_index)
      return !nodelist
        .slice(bgNode_index + 1, node_index)
        .some(n => isCollide(node, n));
    return false;
  }

  static isOutside(node, rootNode) {
    return !isCollide(node, rootNode);
  }

  static isEmtyGroup(node) {
    return node.type === QLayer.name && node.childNum === 0;
  }
}
function isSameColor(colorA, colorB) {
  if (!colorA || !colorB) return false;
  return JSON.stringify(colorA) === JSON.stringify(colorB);
}
module.exports = process;
