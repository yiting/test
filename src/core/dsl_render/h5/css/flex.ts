import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'flex',
  value() {
    if (this._hasWidth()) {
      return 'none';
    }
    return cssDefaultProperty.flex;
  },
};
