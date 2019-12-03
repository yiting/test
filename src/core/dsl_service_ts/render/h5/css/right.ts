//
import Constraints from '../../../helper/constraints';

export default {
  key: 'right',
  value(): any {
    if (
      this._isAbsolute() &&
      this.constrains === Constraints.LayoutSelfHorizontal.Right
    ) {
      return this.parent.abXops - this.abXops;
    } else {
      return null;
    }
  },
};
