import Constraints from '../../../helper/constraints';
import Text from '../../../../dsl_extend/models/text/tpl/h5';
import CssProperty from '../utils/css_property';
//
export default {
  key: 'marginBottom',
  value() {
    if (this._isAbsolute()) {
      return CssProperty.default.marginBottom;
    }
    // 如果为文本节点子节点
    if (this.parent && this.parent.modelName == Text.name) {
      return CssProperty.default.marginBottom;
    }
    if (this._isParentHorizontal()) {
      // 横排计算与父节点距离
      // 如果垂直居中、底对齐则无margin-Top
      if (
        this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Center
      ) {
        return CssProperty.default.marginBottom;
      }
      if (
        this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Start
      ) {
        return CssProperty.default.marginBottom;
      }
      // LayoutAlignItems.Start
      return this.parent.abYops - this.abYops;
    }
    // 竖排计算与上一节点距离
    /**
     * 由于垂直方向使用block，所以统一默认约束为Constraints.LayoutJustifyContent.Start
     */
    /*
        let nextNode = this._nextNode();
        if (!nextNode &&
            this.parent.constraints.LayoutJustifyContent===
            Constraints.LayoutJustifyContent.Center) {
            return null;
        }
        if (this.parent.constraints.LayoutJustifyContent===
          Constraints.LayoutJustifyContent.Start) {
            return null;
        }

        // LayoutJustifyContent.Start
        if (nextNode) {
            css = this.abY - nextNode.abYops;
        } else {
            css = this.abY - this.parent.abY;
        } */
    return CssProperty.default.marginBottom;
  },
};
