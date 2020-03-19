import * as Constraints from '../../../../dsl_helper/constraints';
import Dictionary from '../../../../dsl_helper/dictionary';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';

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
