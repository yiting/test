export default {
  key: 'paddingRight',
  value() {
    const hasWidth = this._hasWidth();
    const lastChild = this._getLastChild();
    if (!hasWidth && lastChild) {
      return this._abXops - lastChild._abXops;
    }
    return null;
  },
};
