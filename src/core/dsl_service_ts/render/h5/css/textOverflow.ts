import CssProperty from '../utils/css_property';
export default {
  key: 'textOverflow',
  value() {
    return CssProperty.default.textOverflow;
    if (this.styles.texts) {
      return 'ellipsis';
    }
    return null;
  },
};
