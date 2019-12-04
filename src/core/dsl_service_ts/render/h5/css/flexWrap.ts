import Constraints from '../../../helper/constraints';
import CssDefault from '../model/css_default';

export default {
  key: 'flexWrap',
  value() {
    if (this.constraints.LayoutWrap === Constraints.LayoutWrap.Wrap) {
      return 'wrap';
    }
    return CssDefault.flexWrap;
  },
};
