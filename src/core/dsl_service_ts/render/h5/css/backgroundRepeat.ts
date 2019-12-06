import CssProperty from '../utils/css_property';
export default {
  key: 'backgroundRepeat',
  value() {
    if (this._isImgTag()) {
      return CssProperty.default.backgroundRepeat;
    }
    if (this.path) {
      return 'no-repeat';
    }
    return CssProperty.default.backgroundRepeat;
  },
};
