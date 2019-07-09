import Constraints from '../../../helper/constraints';
import Common from '../../../dsl2/common';

export default {
  key: 'flexDirection',
  value() {
    if (this.type == Common.QText) {
      return null;
    }
    if (this.display === 'block') {
      return null;
    }
    if (!this.parent) {
      return 'column';
    }
    if (
      this.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal
    ) {
      return 'row';
    }
    return 'column';
  },
};
