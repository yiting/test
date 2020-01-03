import CssProperty from '../propertyMap';
export default {
  key: 'flex',
  value() {
    if (this._hasWidth()) {
      return 'none';
    }
    return CssProperty.default.flex;
  },
};
