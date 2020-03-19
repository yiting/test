import Text from '../../models/text/tpl';
import * as Constraints from '../../../../dsl_helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';
export default {
  key: 'paddingTop',
  value() {
    // 如果为文本节点
    if (this.modelName == Text.name) {
      return cssDefaultProperty.paddingTop;
    }

    if (
      this.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal
    ) {
      return cssDefaultProperty.paddingTop;
    }
    let minPaddingTop: number | null = null;
    let that = this;
    this.children.forEach((cssDom: any) => {
      if (
        cssDom.constraints.LayoutPosition !==
        Constraints.LayoutPosition.Absolute
      ) {
        let pd = cssDom.abY - that.abY;
        minPaddingTop =
          pd >= 0 && (minPaddingTop === null || minPaddingTop > pd)
            ? pd
            : minPaddingTop;
      }
    });
    return minPaddingTop;
  },
};
