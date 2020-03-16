import { defaultProperty as cssDefaultProperty } from '../propertyMap';
//
export default {
  key: 'height',
  value() {
    if (this._hasHeight()) {
      return Math.abs(this.abYops - this.abY);
    }
    return cssDefaultProperty.height;
  },
};
