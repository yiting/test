import Constraints from '../../../dsl_layout/helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
import Dictionary from '../../../dsl_layout/helper/dictionary';

export default {
  key: 'flexDirection',
  value() {
    if (this.display !== 'flex') {
      return cssDefaultProperty.flexDirection;
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
