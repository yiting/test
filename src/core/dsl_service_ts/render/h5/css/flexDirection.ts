import Constraints from '../../../helper/constraints';
import CssDefault from '../model/css_default';
import Dictionary from '../../../helper/dictionary';

export default {
  key: 'flexDirection',
  value() {
    if (this.display !== 'flex') {
      return CssDefault.flexDirection;
    }
    if (
      this.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal
    ) {
      return 'row';
    }
    return 'column';
  },
};
