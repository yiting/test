import Text from '../../../dsl_model/models/text/tpl/h5';
import Constraints from '../../../dsl_service_ts/helper/constraints';
import CssProperty from '../propertyMap';
export default {
  key: 'paddingTop',
  value() {
    // 如果为文本节点
    if (this.modelName == Text.name) {
      return CssProperty.default.paddingTop;
    }

    if (this._hasHeight()) {
      return CssProperty.default.paddingTop;
    }
    let minPaddingTop: number | null = null;
    const that = this;
    this.children.forEach((cssDom: any) => {
      if (
        cssDom.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute
      ) {
        const pd = cssDom.abY - that.abY;
        minPaddingTop =
          pd >= 0 && (minPaddingTop === null || minPaddingTop > pd)
            ? pd
            : minPaddingTop;
      }
    });
    return minPaddingTop;
  },
};
