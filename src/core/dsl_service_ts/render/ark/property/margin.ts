import marginTop from './marginTop';
import marginBottom from './marginBottom';
import marginLeft from './marginLeft';
import marginRight from './marginRight';

export default {
  key: 'margin ',
  value() {
    //数组值保持跟magin属性一样的定位方式：上右下左
    const css: any[] = [0, 0, 0, 0];
    //绝对定位就不需要margin了
    if (this._isAbsolute()) {
      return null;
    }
    //横排
    css[0] = marginLeft.value.call(this);
    css[1] = marginTop.value.call(this);
    css[2] = marginRight.value.call(this);
    css[3] = marginBottom.value.call(this);
    return css.join(',');
  },
};
