import CssDefault from '../model/css_default';
export default {
  key: 'flex',
  value() {
    if (this._hasWidth()) {
      return 'none';
    }
    return CssDefault.flex;
  },
};
