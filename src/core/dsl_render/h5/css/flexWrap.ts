import Constraints from '../../../dsl_layout/helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';

export default {
  key: 'flexWrap',
  value() {
    if (this.constraints.LayoutWrap === Constraints.LayoutWrap.Wrap) {
      return 'wrap';
    }
    return cssDefaultProperty.flexWrap;
  },
};
