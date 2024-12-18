import * as Constraints from '../../../../dsl_helper/constraints';
import Text from '../../models/text/tpl';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';
//
export default {
  key: 'marginRight',
  value() {
    if (this._isAbsolute()) {
      return cssDefaultProperty.marginRight;
    }

    // 如果为文本节点子节点
    if (this.parent && this.parent.modelName == Text.name) {
      return cssDefaultProperty.marginRight;
    }
    if (this._isParentHorizontal()) {
      // 横排计算与上一节点距离
      const nextNode = this._nextNode();
      // 如果水平左对齐
      if (
        this.parent.constraints.LayoutJustifyContent ===
        Constraints.LayoutJustifyContent.Start
      ) {
        return cssDefaultProperty.marginRight;
      }
      // 如果水平居中
      if (
        this.parent.constraints.LayoutJustifyContent ===
        Constraints.LayoutJustifyContent.Center
      ) {
        return cssDefaultProperty.marginRight;
      }

      if (nextNode) {
        return nextNode.abX - this.abXops;
      }
      return this.parent.abXops - this.abXops;
    }
    let vRight = this.parent ? this.parent.abXops - this.abXops : this.abXops;

    // 竖排计算与父节点距离
    // 如果水平居中、或水平右对齐
    if (
      this.parent &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Center
    ) {
      return vRight >= 0 ? 'auto' : vRight;
    }
    if (
      this.parent &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Start
    ) {
      return cssDefaultProperty.marginRight;
    }
    if (
      this.parent &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.End
    ) {
      return vRight;
    }
    return cssDefaultProperty.marginRight;
  },
};
