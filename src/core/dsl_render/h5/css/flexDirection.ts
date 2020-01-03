import Constraints from '../../../dsl_layout/helper/constraints';
import CssProperty from '../propertyMap';
import Dictionary from '../../../dsl_layout/helper/dictionary';

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
