import Constraints from '../../../dsl_service_ts/helper/constraints';
import Text from '../../../dsl_model/models/text/tpl/h5';
import CssProperty from '../propertyMap';

export default {
  key: 'marginLeft',
  value() {
    if (this._isAbsolute()) {
      return CssProperty.default.marginLeft;
    }
    // 如果为文本节点子节点
    if (this.parent && this.parent.modelName == Text.name) {
      return CssProperty.default.marginLeft;
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
        return CssProperty.default.marginLeft;
      }
      if (
        this.parent.constraints.LayoutJustifyContent ===
        Constraints.LayoutJustifyContent.End
      ) {
        return CssProperty.default.marginLeft;
      }
      // LayoutJustifyContent.Start
      if (preNode) {
        return this.abX - preNode.abXops;
      }
      return this.abX - this.parent.abX;
    }
    let vLeft = this.parent ? this.abX - this.parent.abX : this.abX;
    // 竖排计算与父节点距离
    // 如果水平居中、或水平右对齐
    if (
      this.parent &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Center
    ) {
      return vLeft > 0 ? 'auto' : vLeft;
    }
    if (
      this.parent &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.End
    ) {
      return CssProperty.default.marginLeft;
    }
    return vLeft;
  },
};
