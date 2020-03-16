//
import { defaultProperty as cssDefaultProperty } from '../propertyMap';
export default {
  key: 'top',
  value() {
    if (false) {
      // 这里是预留给fixed定位约束
      return this.abY;
    } else if (this._isAbsolute()) {
      return this._top;
    }
    return cssDefaultProperty.top;
  },
};
