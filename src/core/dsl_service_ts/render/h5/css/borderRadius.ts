import CssProperty from '../utils/css_property';
import Func from '../utils/css_func';

export default {
  key: 'borderRadius',
  value(): any {
    if (this.styles.borderRadius) {
      return Func.getRadius(
        this.styles.borderRadius,
        Math.min(this.abYops - this.abY, this.abXops - this.abX),
      );
    }
    return CssProperty.default.borderRadius;
  },
};
