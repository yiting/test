import { defaultProperty as cssDefaultProperty } from '../propertyMap';
import Func from '../../utils/css_func';

export default {
  key: 'borderRadius',
  value(): any {
    if (this.styles.borderRadius) {
      return Func.getRadius(
        this.styles.borderRadius,
        Math.min(this.abYops - this.abY, this.abXops - this.abX),
      );
    }
    return cssDefaultProperty.borderRadius;
  },
};
