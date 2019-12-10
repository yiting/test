import Constraints from '../../../helper/constraints';
import Text from '../../../../dsl_extend/models/text/tpl/h5';
import paddingTop from './paddingTop';
import CssProperty from '../utils/css_property';

export default {
  key: 'marginTop',
  value() {
    let css = null;
    if (this._isAbsolute()) {
      return css;
    }
    // 如果为文本节点子节点
    if (this.parent && this.parent.modelName == Text.name) {
      return CssProperty.default.marginTop;
    }
    let parentPaddingTop =
      (this.parent && paddingTop.value.call(this.parent)) ||
      CssProperty.default.marginTop;

    if (this._isParentHorizontal()) {
      // 横排计算与父节点距离
      // 如果垂直居中、底对齐则无margin-Top
      if (
        this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Center
      ) {
        return CssProperty.default.marginTop;
      }
      if (
        this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.End
      ) {
        return CssProperty.default.marginTop;
      }
      // 如果有上一行
      if (this._prevLine().length) {
        const prevLineAbYops = this._prevLine().map((n: any) => n.abYops);
        const maxTop = Math.max(...prevLineAbYops) || this.parent.abY;
        // LayoutAlignItems.Start
        css = this.abY - maxTop;
      } else {
        css = this.abY - this.parent.abY - parentPaddingTop;
      }
    } else {
      // 竖排计算与上一节点距离
      const preNode = this._prevNode();
      if (preNode) {
        css = this.abY - preNode.abYops;
      } else if (this.parent) {
        css = this.abY - this.parent.abY - parentPaddingTop;
      } else {
        css = this.abY;
      }
    }
    return css;
  },
};
