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
      if (this._prevLine().length) {
        const prevLineAbYops = this._prevLine().map((n: any) => n.abYops);
        const maxTop = Math.max(...prevLineAbYops) || this.parent.abY;
        // LayoutAlignItems.Start
        return this.abY - maxTop;
      } else {
        return this.abY - this.parent.abY;
      }
    } else {
      // 竖排计算与上一节点距离
      const preNode = this._prevNode();
      /**
       * 由于垂直方向使用block，所以统一默认约束为Constraints.LayoutJustifyContent.Start
       */
      /* if (!preNode &&
          this.parent.constraints.LayoutJustifyContent===
          Constraints.LayoutJustifyContent.Center) {
          return null;
      }
      if (this.parent.constraints.LayoutJustifyContent===
        Constraints.LayoutJustifyContent.End) {
          return null;
      } */

      // LayoutJustifyContent.Start
      if (preNode) {
        return this.abY - preNode.abYops;
      } else if (this.parent) {
        return this.abY - this.parent.abY;
      } else {
        return this.abY;
      }
    }
  },
};