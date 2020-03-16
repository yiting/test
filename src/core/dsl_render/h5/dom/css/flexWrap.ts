import Constraints from '../../../../dsl_helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';
export default {
  key: 'flexWrap',
  value() {
    if (this.constraints.LayoutWrap === Constraints.LayoutWrap.Wrap) {
      return 'wrap';
    }
    return cssDefaultProperty.flexWrap;
  },
};
