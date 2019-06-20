import Constraints from '../../../dsl/constraints';
import Func from '../css_func';

export default {
  key: 'margin ',
  value() {
    //数组值保持跟magin属性一样的定位方式：上右下左
    const css: any[] = [0, 0, 0, 0];
    //绝对定位就不需要margin了
    if (this._isAbsolute()) {
      return css.join(' ');
    }
    //横排
    const preNode = this._prevNode();
    const nextNode = this._nextNode();
    if (this._isParentHorizontal()) {
      //上下计算
      switch (this.parent.constraints.LayoutAlignItems) {
        case Constraints.LayoutAlignItems.Start:
          css[0] = this._abY - this.parent._abY;
          css[2] = 0;
          break;
        case Constraints.LayoutAlignItems.Center:
          css[0] = 0;
          css[2] = 0;
          break;
        case Constraints.LayoutAlignItems.End:
          css[0] = 0;
          css[2] = this.parent._abYops - this._abYops;
          break;
        default:
          css[2] = this.parent._abYops - this._abYops;
          css[0] = this._abY - this.parent._abY;
          break;
      }
      //左右计算
      switch (this.parent.constraints.LayoutJustifyContent) {
        case Constraints.LayoutJustifyContent.Start:
          css[1] = 0;
          css[3] = 'auto';
          break;
        case Constraints.LayoutJustifyContent.Center:
          css[1] = 'auto';
          css[3] = 'auto';
          break;
        case Constraints.LayoutJustifyContent.End:
          css[1] = 'auto';
          css[3] = 0;
          break;
        default:
          break;
      }
      if (preNode) {
        css[3] = this._abX - preNode._abXops;
      } else {
        css[3] = this._abX - this.parent._abX;
      }
      if (nextNode) {
        css[1] = nextNode._abX - this._abXops;
      } else {
        css[1] = this.parent._abXops - this._abXops;
      }
    } else {
      //竖排
      //上下计算
      // 竖排计算与上一节点距离
      // LayoutJustifyContent.Start
      if (preNode) {
        css[0] = this._abY - preNode._abYops;
      } else if (this.parent) {
        css[0] = this._abY - this.parent._abY;
      } else {
        css[0] = this._abY;
      }
      //由于垂直方向使用block，所以统一默认约束为Constraints.LayoutJustifyContent.Start
      css[2] = 0;
      //左右计算

      if (this.parent) {
        if (
          this.parent.constraints.LayoutAlignItems ===
          Constraints.LayoutAlignItems.Center
        ) {
          css[1] = 'auto';
          css[3] = 'auto';
        }
        if (
          this.parent.constraints.LayoutAlignItems ===
          Constraints.LayoutAlignItems.Start
        ) {
          css[1] = 0;
          css[3] = 0;
        }
        if (
          this.parent.constraints.LayoutAlignItems ===
          Constraints.LayoutAlignItems.End
        ) {
          css[1] = this.parent._abXops - this._abXops;
        }
        css[3] = this._abX - this.parent._abX;
      } else {
        css[1] = 0;
        css[3] = this._abX;
      }
    }
    //最终回溯，水平方向如果只有一个节点，并且左右偏差不是很大，就直接水平居中
    if (
      !nextNode &&
      !preNode &&
      Math.abs(Math.abs(css[1]) - Math.abs(css[3])) < 50
    ) {
      css[1] = css[3] = 'auto';
    }
    css.forEach((item: any, key: number) => {
      if (typeof item === 'number') {
        css[key] = Func.transUnit(item);
      }
    });
    return css.join(' ');
  },
};
