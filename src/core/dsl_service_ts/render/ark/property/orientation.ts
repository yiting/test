import Constraints from '../../../helper/constraints';
export default {
  key: 'orientation',
  value() {
    // 水平布局
    if (this.tagName !== 'Layout') {
      return null;
    }
    if (
      this.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal
    ) {
      return 'Horizontal';
    } else {
      return 'Vertical';
    }
  },
};
