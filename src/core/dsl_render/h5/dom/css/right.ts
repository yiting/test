//
import Constraints from '../../../../dsl_helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';

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
