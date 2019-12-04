import CssDefault from '../model/css_default';
export default {
  key: 'textOverflow',
  value() {
    return CssDefault.textOverflow;
    if (this.styles.texts) {
      return 'ellipsis';
    }
    return null;
  },
};
