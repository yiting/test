import CssDefault from '../model/css_default';
import Func from '../utils/css_func';

export default {
  key: 'borderRadius',
  value() {
    if (this.styles.borderRadius) {
      return Func.getRadius(
        this.styles.borderRadius,
        Math.min(this.abYops - this.abY, this.abXops - this.abX),
      );
    }
    return CssDefault.borderRadius;
  },
};
