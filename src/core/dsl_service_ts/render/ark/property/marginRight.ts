import Constraints from '../../../helper/constraints';
//
export default {
  key: 'marginRight',
  value() {
    if (this._isAbsolute()) {
      return null;
    }

    if (this._isParentHorizontal()) {
      // 横排计算与上一节点距离
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

      return this.parent.abXops - this.abXops;
    }
    // 竖排计算与父节点距离
    // 如果水平居中、或水平右对齐
    if (
      this.parent &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Center
    ) {
      return 0;
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
    return 0;
  },
};
