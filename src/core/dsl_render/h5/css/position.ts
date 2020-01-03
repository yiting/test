import Constraints from '../../../dsl_service_ts/helper/constraints';
import CssProperty from '../propertyMap';
export default {
  key: 'position',
  value() {
    /* if (this._isAbsolute()) {
      return 'absolute';
    }
    return 'relative'; */

    if (
      this.constraints['LayoutSelfPosition'] ===
      Constraints.LayoutSelfPosition.Absolute
    ) {
      return 'absolute';
    } else if (
      this.constraints['LayoutPosition'] === Constraints.LayoutPosition.Absolute
    ) {
      return 'relative';
    }
    return CssProperty.default.position;
  },
};
