import CssDefault from '../model/css_default';
//
export default {
  key: 'zIndex',
  value() {
    if (this._isAbsolute()) {
      return this.zindex;
    }
    // return null;
    return CssDefault.zIndex;
  },
};
