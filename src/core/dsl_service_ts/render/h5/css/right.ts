//
import Constraints from '../../../helper/constraints';
import CssDefault from '../model/css_default';

export default {
  key: 'right',
  value(): any {
    if (
      this._isAbsolute() &&
      this.constrains === Constraints.LayoutSelfHorizontal.Right
    ) {
      return this.parent.abXops - this.abXops;
    } else {
      return CssDefault.right;
    }
  },
};
