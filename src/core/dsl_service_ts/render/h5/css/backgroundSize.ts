import CssDefault from '../model/css_default';
export default {
  key: 'backgroundSize',
  value() {
    if (this._isImgTag()) {
      return CssDefault.backgroundSize;
    }
    if (this.path) {
      return 'contain';
    }
    return CssDefault.backgroundSize;
  },
};
