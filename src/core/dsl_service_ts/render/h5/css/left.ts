//
export default {
  key: 'left',
  value() {
    let css = null;
    if (false) {
      // 这里是预留给fixed定位约束
      css = this._abX;
    } else if (this._isAbsolute()) {
      css = this.parentX;
    } else {
      return null;
    }
    return css;
  },
};
