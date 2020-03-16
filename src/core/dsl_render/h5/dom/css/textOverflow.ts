import { defaultProperty as cssDefaultProperty } from '../propertyMap';
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
