import CssProperty from '../propertyMap';
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
