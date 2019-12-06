import Constraints from '../../../helper/constraints';
import CssProperty from '../utils/css_property';
import Dictionary from '../../../helper/dictionary';

export default {
  key: 'flexDirection',
  value() {
    if (this.display !== 'flex') {
      return CssProperty.default.flexDirection;
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
