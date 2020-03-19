import * as Constraints from '../../../dsl_helper/constraints';

export default {
  key: 'marginTop',
  value() {
    const isHorizontal = this._isParentHorizontal();
    const prop = isHorizontal ? 'LayoutAlignItems' : 'LayoutJustifyContent';
    if (this.parent) {
      if (this.parent.constraints[prop] === Constraints[prop].Center) {
        return 0;
      }
      if (this.parent.constraints[prop] === Constraints[prop].End) {
        return 0;
      }
      // 竖排计算与上一节点距离
      return this.abY - this.parent.abY;
    } else {
      return this.abY;
    }
  },
};
