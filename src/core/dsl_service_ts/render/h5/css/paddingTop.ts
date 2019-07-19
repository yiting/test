export default {
  key: 'paddingTop',
  value() {
    // let firstChild = this._getFirstChild(this);
    const firstChild = this._usePaddingTop();
    if (firstChild) {
      return firstChild.abY - this.abY;
    }
    return null;
  },
};
