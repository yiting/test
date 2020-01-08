import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'textOverflow',
  value() {
    return cssDefaultProperty.textOverflow;
    if (this.styles.texts) {
      return 'ellipsis';
    }
    return null;
  },
};
