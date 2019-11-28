import Func from '../model/css_func';

export default {
  key: 'borderRadius',
  value() {
    if (this.styles.borderRadius) {
      return Func.getRadius(
        this.styles.borderRadius,
        Math.min(this.abYops - this.abY, this.abXops - this.abX),
      );
    }
    return null;
  },
};
