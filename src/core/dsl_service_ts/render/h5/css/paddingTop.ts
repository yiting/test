export default {
  key: 'paddingTop',
  value() {
    // let firstChild = this._getFirstChild(this);
    const firstChild = this._usePaddingTop();
    if (firstChild) {
      return firstChild._abY - this._abY;
    }
    return null;
  },
};
