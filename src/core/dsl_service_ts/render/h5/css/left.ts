import Constraints from '../../../helper/constraints';
import CssDefault from '../model/css_default';

export default {
  key: 'left',
  value(): any {
    if (
      this._isAbsolute() &&
      this.constrains !== Constraints.LayoutSelfHorizontal.Right
    ) {
      return this.parentX;
    } else {
      return CssDefault.left;
    }
  },
};
