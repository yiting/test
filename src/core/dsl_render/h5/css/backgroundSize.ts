import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'backgroundSize',
  value() {
    if (this.path) {
      return 'contain';
    }
    return cssDefaultProperty.backgroundSize;
  },
};
