import { defaultProperty as cssDefaultProperty } from '../propertyMap';
export default {
  key: 'zIndex',
  value() {
    if (this._isAbsolute()) {
      return this.zindex;
    }
    // return null;
    return cssDefaultProperty.zIndex;
  },
};
