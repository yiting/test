import Constraints from '../../../dsl_layout/helper/constraints';
import CssProperty from '../propertyMap';

export default {
  key: 'flexWrap',
  value() {
    if (this.constraints.LayoutWrap === Constraints.LayoutWrap.Wrap) {
      return 'wrap';
    }
    return CssProperty.default.flexWrap;
  },
};
