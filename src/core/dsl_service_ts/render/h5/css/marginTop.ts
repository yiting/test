import Constraints from '../../../helper/constraints';
import Text from '../../../../dsl_extend/models/text/tpl/h5';

export default {
  key: 'marginTop',
  value() {
    let css = null;
    if (this._isAbsolute()) {
      return css;
    }
    // 如果为文本节点子节点
    if (this.parent && this.parent.modelName == Text.name) {
      return null;
    }
    const firstChild = this.parent && this.parent._usePaddingTop();
    if (firstChild === this) {
      return 0;
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
        css = this.abY - maxTop;
      } else {
        css = this.abY - this.parent.abY;
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
        css = this.abY - preNode.abYops;
      } else if (this.parent) {
        css = this.abY - this.parent.abY;
      } else {
        css = this.abY;
      }
    }
    return css;
  },
};
