import Constraints from '../../../helper/constraints';

export default {
  key: 'marginTop',
  value() {
    if (this._isAbsolute()) {
      return null;
    }
    if (this._isParentHorizontal()) {
      // 横排计算与父节点距离
      // 如果垂直居中、底对齐则无margin-Top
      if (
        this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Center
      ) {
        return 0;
      }
      if (
        this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.End
      ) {
        return 0;
      }
    } else {
      // 竖排计算与上一节点距离
      if (this.parent) {
        return this.abY - this.parent.abY;
      } else {
        return this.abY;
      }
    }
  },
};
