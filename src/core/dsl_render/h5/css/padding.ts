import Constraints from '../../../dsl_layout/helper/constraints';
import Func from '../utils/css_func';
import paddingTop from './paddingTop';
import paddingBottom from './paddingBottom';
import paddingLeft from './paddingLeft';
import paddingRight from './paddingRight';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'padding',
  value() {
    /* 未知这段为何被使用，暂时注释删除
    if (!this.parent) {
      return cssDefaultProperty.padding;
    } */
    const css: any[] = [0, 0, 0, 0];
    //横排
    css[0] = paddingTop.value.call(this) || 0;
    css[1] = paddingRight.value.call(this) || 0;
    css[2] = paddingBottom.value.call(this) || 0;
    css[3] = paddingLeft.value.call(this) || 0;
    if (Number(css.join('')) === 0) {
      return '0';
    }

    css.forEach((item: any, key: number) => {
      if (typeof item === 'number') {
        css[key] = Func.transUnit(item);
      }
    });
    return css.join(' ');
  },
};
