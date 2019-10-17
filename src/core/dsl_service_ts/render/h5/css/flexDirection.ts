import Constraints from '../../../helper/constraints';
import Dictionary from '../../../helper/dictionary';

export default {
  key: 'flexDirection',
  value() {
    if (this.type == Dictionary.type.QText) {
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
