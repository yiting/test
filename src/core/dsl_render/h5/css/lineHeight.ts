import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'lineHeight',
  value() {
    if (this.styles.texts && this.styles.texts.length) {
      return this.styles.lineHeight;
    }
    return cssDefaultProperty.lineHeight;
  },
};
