import Constraints from '../../../dsl/constraints';

export default {
  key: 'flexWrap',
  value() {
    if (this.constraints.LayoutWrap === Constraints.LayoutWrap.Wrap) {
      return 'wrap';
    }
    return null; //nowrap
  },
};
