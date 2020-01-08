import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'opacity',
  value(): any {
    const opacity = +this.styles.opacity;
    if (typeof opacity === 'number' && !isNaN(opacity)) {
      return opacity;
    }
    return cssDefaultProperty.opacity;
  },
};
