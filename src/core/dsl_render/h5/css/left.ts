import Constraints from '../../../dsl_layout/helper/constraints';
import CssProperty from '../propertyMap';

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
