import Constraints from '../../../dsl/constraints';
//
export default {
  key: 'marginRight',
  value() {
    if (this._isAbsolute()) {
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
        return nextNode._abX - this._abXops;
      }
      return this.parent._abXops - this._abXops;
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
      return this.parent._abXops - this._abXops;
    }
    return null;
  },
};
