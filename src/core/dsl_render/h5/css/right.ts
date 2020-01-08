//
import Constraints from '../../../dsl_layout/helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';

export default {
  key: 'right',
  value(): any {
    if (
      this._isAbsolute() &&
      this.constrains === Constraints.LayoutSelfHorizontal.Right
    ) {
      return this._right;
    } else {
      return cssDefaultProperty.right;
    }
  },
};
