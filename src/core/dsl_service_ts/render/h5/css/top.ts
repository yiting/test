//
export default {
  key: 'top',
  value() {
    let css = null;

    if (false) {
      // 这里是预留给fixed定位约束
      css = this._abY;
    } else if (this._isAbsolute()) {
      css = this.parentY;
    } else {
      return null;
    }
    return css;
  },
};
