//
import Constraints from '../../../helper/constraints';
import CssProperty from '../utils/css_property';

export default {
  key: 'right',
  value(): any {
    if (
      this._isAbsolute() &&
      this.constrains === Constraints.LayoutSelfHorizontal.Right
    ) {
      return this.parent.abXops - this.abXops;
    } else {
      return CssProperty.default.right;
    }
  },
};
