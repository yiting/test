import Constraints from '../../../dsl/constraints';

export default {
  key: 'flexDirection',
  value() {
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
