import * as Constraints from '../../../../dsl_helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';
export default {
  key: 'position',
  value() {
    /* if (this._isAbsolute()) {
      return 'absolute';
    }
    return 'relative'; */

    if (
      this.constraints['LayoutPosition'] === Constraints.LayoutPosition.Absolute
    ) {
      return 'absolute';
    } else if (
      // this.constraints['LayoutPosition'] === Constraints.LayoutPosition.Absolute
      this.children.some(
        (child: any) =>
          child.constraints.LayoutPosition ===
          Constraints.LayoutPosition.Absolute,
      )
    ) {
      return 'relative';
    }
    return cssDefaultProperty.position;
  },
};
