import Constraints from '../../../helper/constraints';

export default {
  key: 'marginLeft ',
  value() {
    const isHorizontal = this._isParentHorizontal();
    const prop = isHorizontal ? 'LayoutJustifyContent' : 'LayoutAlignItems';
    // 横排计算与上一节点距离
    // const preNode = this._prevNode();

    // 如果水平居中、或水平右对齐，第一个子节点无margin-left
    if (this.parent) {
      if (this.parent.constraints[prop] === Constraints[prop].Center) {
        return 0;
      }
      if (this.parent.constraints[prop] === Constraints[prop].End) {
        return 0;
      }
    }
    if (this.parent) {
      return this.abX - this.parent.abX;
    }
    // LayoutJustifyContent.Start
    return this.abX;
  },
};
