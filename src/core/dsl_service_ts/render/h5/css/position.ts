import Constraints from '../../../helper/constraints';
import CssDefault from '../model/css_default';
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
    return CssDefault.position;
  },
};
