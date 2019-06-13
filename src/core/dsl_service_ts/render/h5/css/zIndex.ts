//
export default {
  key: 'zIndex',
  value() {
    if (this._isAbsolute()) {
      return this._zIndex;
    }
    return null;
  },
};
