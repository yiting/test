import Constraints from '../../../dsl_service_ts/helper/constraints';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import CssProperty from '../propertyMap';

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
