//
import CssProperty from '../utils/css_property';
export default {
  key: 'top',
  value() {
    if (false) {
      // 这里是预留给fixed定位约束
      return this.abY;
    } else if (this._isAbsolute()) {
      return this.parentY;
    }
    return CssProperty.default.top;
  },
};
