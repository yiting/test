import Constraints from '../../../dsl/constraints';

export default {
  key: 'left',
  value(): any {
    if (false) {
      // 这里是预留给fixed定位约束
      return this._abX;
    } else if (
      this._isAbsolute() &&
      this.constrains !== Constraints.LayoutSelfHorizontal.Right
    ) {
      return this.parentX;
    } else {
      return null;
    }
  },
};
