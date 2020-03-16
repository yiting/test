import { defaultProperty as cssDefaultProperty } from '../propertyMap';
export default {
  key: 'backgroundSize',
  value() {
    if (this.path) {
      return 'contain';
    }
    return cssDefaultProperty.backgroundSize;
  },
};
