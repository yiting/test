import CssDefault from '../model/css_default';
//
export default {
  key: 'height',
  value() {
    if (this._hasHeight()) {
      return Math.abs(this.abYops - this.abY);
    }
    return CssDefault.height;
  },
};
