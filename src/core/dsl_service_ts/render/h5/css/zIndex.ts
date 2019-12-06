import CssProperty from '../utils/css_property';
//
export default {
  key: 'zIndex',
  value() {
    if (this._isAbsolute()) {
      return this.zindex;
    }
    // return null;
    return CssProperty.default.zIndex;
  },
};
