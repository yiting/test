import CssProperty from '../utils/css_property';
//
export default {
  key: 'height',
  value() {
    if (this._hasHeight()) {
      return Math.abs(this.abYops - this.abY);
    }
    return CssProperty.default.height;
  },
};
