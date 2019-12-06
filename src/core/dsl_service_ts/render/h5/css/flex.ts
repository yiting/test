import CssProperty from '../utils/css_property';
export default {
  key: 'flex',
  value() {
    if (this._hasWidth()) {
      return 'none';
    }
    return CssProperty.default.flex;
  },
};
