import Constraints from '../../../../dsl_helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';

export default {
  key: 'left',
  value(): any {
    if (
      this._isAbsolute() &&
      this.constrains !== Constraints.LayoutSelfHorizontal.Right
    ) {
      return this._left;
    } else {
      return cssDefaultProperty.left;
    }
  },
};
