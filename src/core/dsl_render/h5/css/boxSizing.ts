import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'boxSizing',
  value() {
    if (this.styles.border && this.styles.border.width) {
      return 'border-box';
    }
    return cssDefaultProperty.boxSizing;
  },
};
