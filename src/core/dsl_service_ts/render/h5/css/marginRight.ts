import Constraints from '../../../helper/constraints';
import Text from '../../../template/html/base/text';
//
export default {
  key: 'marginRight',
  value() {
    if (this._isAbsolute()) {
      return null;
    }

    // 如果为文本节点子节点
    if (this.parent && this.parent.modelName == Text.name) {
      return null;
    }
    if (this._isParentHorizontal()) {
      // 横排计算与上一节点距离
      const nextNode = this._nextNode();
      // 如果水平左对齐
      if (
        this.parent.constraints.LayoutJustifyContent ===
        Constraints.LayoutJustifyContent.Start
      ) {
        return 0;
      }
      // 如果水平居中
      if (
        this.parent.constraints.LayoutJustifyContent ===
        Constraints.LayoutJustifyContent.Center
      ) {
        return 0;
      }

      if (nextNode) {
        return nextNode.abX - this.abXops;
      }
      return this.parent.abXops - this.abXops;
    }
    // 竖排计算与父节点距离
    // 如果水平居中、或水平右对齐
    if (
      this.parent &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Center
    ) {
      return 'auto';
    }
    if (
      this.parent &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Start
    ) {
      return 0;
    }
    if (
      this.parent &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.End
    ) {
      return this.parent.abXops - this.abXops;
    }
    return null;
  },
};
