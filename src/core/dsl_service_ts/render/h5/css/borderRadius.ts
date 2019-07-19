import Func from '../css_func';

export default {
  key: 'borderRadius',
  value() {
    if (this.styles.borderRadius) {
      return Func.getRadius(
        this.styles.borderRadius,
        Math.min(this._abYops - this._abY, this._abXops - this._abX),
      );
    }
    return null;
  },
};
