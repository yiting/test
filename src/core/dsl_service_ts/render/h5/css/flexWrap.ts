import Constraints from '../../../helper/constraints';
import CssProperty from '../utils/css_property';

export default {
  key: 'flexWrap',
  value() {
    if (this.constraints.LayoutWrap === Constraints.LayoutWrap.Wrap) {
      return 'wrap';
    }
    return CssProperty.default.flexWrap;
  },
};
