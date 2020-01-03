import Constraints from '../../../dsl_layout/helper/constraints';
import Text from '../models/text/tpl';
import CssProperty from '../propertyMap';
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
