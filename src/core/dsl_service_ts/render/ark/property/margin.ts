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
    const preNode = this._prevNode();
    const nextNode = this._nextNode();
    css[0] = marginTop.value.call(this);
    css[1] = marginRight.value.call(this);
    css[2] = marginBottom.value.call(this);
    css[3] = marginLeft.value.call(this);
    //最终回溯，水平方向如果只有一个节点，并且左右偏差不是很大，就直接水平居中
    if (
      !nextNode &&
      !preNode &&
      (Math.abs(Math.abs(css[1]) - Math.abs(css[3])) < 10 ||
        Math.abs(
          Math.abs(this.abX - this.parent.abX) -
            Math.abs(this.parent.abXops - this.abXops),
        ) < 10)
    ) {
      css[1] = css[3] = 0;
    }
    css.forEach((item: any, key: number) => {
      if (typeof item === 'number') {
        css[key] = item;
      }
    });
    return css.join(',');
  },
};