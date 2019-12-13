import Constraints from '../../../helper/constraints';
import Dictionary from '../../../helper/dictionary';
import CssProperty from '../utils/css_property';

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
    return CssProperty.default.verticalAlign;
  },
};
