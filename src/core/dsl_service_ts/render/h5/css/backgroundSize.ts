import CssProperty from '../utils/css_property';
export default {
  key: 'backgroundSize',
  value() {
    if (this._isImgTag()) {
      return CssProperty.default.backgroundSize;
    }
    if (this.path) {
      return 'contain';
    }
    return CssProperty.default.backgroundSize;
  },
};
