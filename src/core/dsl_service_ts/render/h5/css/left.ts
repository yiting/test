import Constraints from '../../../helper/constraints';
import CssProperty from '../utils/css_property';

export default {
  key: 'left',
  value(): any {
    if (
      this._isAbsolute() &&
      this.constrains !== Constraints.LayoutSelfHorizontal.Right
    ) {
      return this.parentX;
    } else {
      return CssProperty.default.left;
    }
  },
};
