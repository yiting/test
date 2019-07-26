import Constraints from '../../../helper/constraints';

//
export default {
  key: 'marginBottom',
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
        Constraints.LayoutAlignItems.Start
      ) {
        return 0;
      }
      // LayoutAlignItems.Start
      return this.parent.abYops - this.abYops;
    }
    return 0;
  },
};
