import Constraints from '../../../helper/constraints';

//
export default {
  key: 'marginBottom',
  value() {
    const isHorizontal = this._isParentHorizontal();
    const prop = isHorizontal ? 'LayoutAlignItems' : 'LayoutJustifyContent';
    if (this.parent) {
      // 横排计算与父节点距离
      // 如果垂直居中、底对齐则无margin-Top
      if (this.parent.constraints[prop] === Constraints[prop].Center) {
        return 0;
      }
      if (this.parent.constraints[prop] === Constraints[prop].Start) {
        return 0;
      }
      return this.parent.abYops - this.abYops;
    }
    return 0;
  },
};
