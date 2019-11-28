import Constraints from '../../../helper/constraints';

export default {
  key: 'left',
  value(): any {
    if (
      this._isAbsolute() &&
      this.constrains !== Constraints.LayoutSelfHorizontal.Right
    ) {
      return this.parentX;
    } else {
      return null;
    }
  },
};
