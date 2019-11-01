import Constraints from '../../../helper/constraints';
import Dictionary from '../../../helper/dictionary';

export default {
  key: 'flexDirection',
  value() {
    if (this.display !== 'flex') {
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
