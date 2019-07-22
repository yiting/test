export default {
  key: 'paddingLeft',
  value() {
    const hasWidth = this._hasWidth();
    const firstChild = this._getFirstChild();
    if (!hasWidth && firstChild) {
      return firstChild._abX - this._abX;
    }
    return null;
  },
};
