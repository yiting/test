import Constraints from '../../../helper/constraints';

export default {
  key: 'marginLeft ',
  value() {
    if (this._isAbsolute()) {
      return null;
    }

    if (this._isParentHorizontal()) {
      // 横排计算与上一节点距离
      const preNode = this._prevNode();

      // 如果水平居中、或水平右对齐，第一个子节点无margin-left
      if (
        this.parent.constraints.LayoutJustifyContent ===
          Constraints.LayoutJustifyContent.Center &&
        !preNode
      ) {
        return 0;
      }
      if (
        this.parent.constraints.LayoutJustifyContent ===
        Constraints.LayoutJustifyContent.End
      ) {
        return 0;
      }
      // LayoutJustifyContent.Start
      if (preNode) {
        return this.abX - preNode.abXops;
      }
      return this.abX - this.parent.abX;
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
        Constraints.LayoutAlignItems.End
    ) {
      return 0;
    }
    if (this.parent) {
      return this.abX - this.parent.abX;
    }
    return this.abX;
  },
};
