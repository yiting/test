import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'backgroundRepeat',
  value() {
    if (this.path) {
      return 'no-repeat';
    }
    return cssDefaultProperty.backgroundRepeat;
  },
};
