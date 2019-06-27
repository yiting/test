//
export default {
  key: 'height',
  value() {
    if (this._hasHeight()) {
      return Math.abs(this._abYops - this._abY);
    }
    return null;
  },
};
