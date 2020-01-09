import Constraints from '../../../dsl_layout/helper/constraints';
import Dictionary from '../../../dsl_layout/helper/dictionary';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';

export default {
  key: 'verticalAlign',
  value() {
    if (
      this.parent &&
      this.parent.type === Dictionary.type.QText &&
      this.parent.constraints.LayoutAlignItems ===
        Constraints.LayoutAlignItems.Center
    ) {
      return 'middle';
    }
    return cssDefaultProperty.verticalAlign;
  },
};
