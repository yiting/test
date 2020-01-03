//
import Constraints from '../../../dsl_service_ts/helper/constraints';
import CssProperty from '../propertyMap';

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
