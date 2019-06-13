export default {
  key: 'whiteSpace',
  value() {
    if (this._height / this.lineHeight < 1.2) {
      return 'nowrap';
    }
    return null;
  },
};
