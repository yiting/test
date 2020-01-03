import CssProperty from '../propertyMap';
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
