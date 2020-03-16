import Constraints from '../../../dsl_helper/constraints';
//
export default {
  key: 'marginRight',
  value() {
    const isHorizontal = this._isParentHorizontal();
    const prop = isHorizontal ? 'LayoutJustifyContent' : 'LayoutAlignItems';
    // 横排计算与上一节点距离
    // const nextNode = this._nextNode();

    // 如果水平居中、或水平右对齐，第一个子节点无margin-left
    if (this.parent) {
      if (this.parent.constraints[prop] === Constraints[prop].Center) {
        return 0;
      }
      if (this.parent.constraints[prop] === Constraints[prop].Start) {
        return 0;
      }
      return this.parent.abXops - this.abXops;
    }
    // LayoutJustifyContent.Start
    return 0;
  },
};
