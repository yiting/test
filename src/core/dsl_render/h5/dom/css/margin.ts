import Constraints from '../../../../dsl_helper/constraints';
import Func from '../../utils/css_func';
import marginTop from './marginTop';
import marginBottom from './marginBottom';
import marginLeft from './marginLeft';
import marginRight from './marginRight';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';
import { debug } from 'util';

export default {
  key: 'margin',
  value() {
    //数组值保持跟magin属性一样的定位方式：上右下左
    const css: any[] = [0, 0, 0, 0];
    if (!this.parent) {
      return cssDefaultProperty.margin;
    }
    //绝对定位就不需要margin了
    if (this._isAbsolute()) {
      return cssDefaultProperty.margin;
    }
    //横排
    css[0] = marginTop.value.call(this) || 0;
    css[1] = marginRight.value.call(this) || 0;
    css[2] = marginBottom.value.call(this) || 0;
    css[3] = marginLeft.value.call(this) || 0;
    if (Number(css.join('')) === 0) {
      return '0';
    }
    const preNode = this._prevNode();
    const nextNode = this._nextNode();
    const ml = this.abX - this.parent.abX;
    const mr = this.parent.abXops - this.abXops;
    const range = 10;
    //最终回溯，水平方向如果只有一个节点，并且左右偏差不是很大，就直接水平居中
    if (
      !nextNode &&
      !preNode &&
      this._hasWidth() &&
      (ml > range && mr > range && Math.abs(ml - mr) < range)
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
