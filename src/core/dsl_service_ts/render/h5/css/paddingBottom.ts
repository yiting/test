import Constraints from '../../../helper/constraints';
import Text from '../../../../dsl_extend/models/text/tpl/h5';
import CssProperty from '../utils/css_property';
export default {
  key: 'paddingBottom',
  value() {
    // 如果为文本节点
    if (this.modelName == Text.name) {
      return CssProperty.default.paddingBottom;
    }
    if (this._hasHeight()) {
      return CssProperty.default.paddingBottom;
    }
    let minPaddingBottom: number | null = null;
    const that = this;
    this.children.forEach((cssDom: any) => {
      if (
        cssDom.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute
      ) {
        const pd = that.abYops - cssDom.abYops;
        minPaddingBottom =
          pd >= 0 && (minPaddingBottom === null || minPaddingBottom > pd)
            ? pd
            : minPaddingBottom;
      }
    });
    return minPaddingBottom;
  },
};
