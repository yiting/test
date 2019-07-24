//
import Constraints from '../../../helper/constraints';

export default {
  key: 'right',
  value(): any {
    if (false) {
      // 这里是预留给fixed定位约束
      return this.abX;
    } else if (
      this._isAbsolute() &&
      this.constrains === Constraints.LayoutSelfHorizontal.Right
    ) {
      return this.parent.abXops - this.abXops;
    } else {
      return null;
    }
  },
};
