//
export default {
  key: 'height',
  value() {
    return Math.abs(this._abYops - this._abY);
  },
};
