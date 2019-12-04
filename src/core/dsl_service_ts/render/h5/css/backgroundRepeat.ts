import CssDefault from '../model/css_default';
export default {
  key: 'backgroundRepeat',
  value() {
    if (this._isImgTag()) {
      return CssDefault.backgroundRepeat;
    }
    if (this.path) {
      return 'no-repeat';
    }
    return CssDefault.backgroundRepeat;
  },
};
