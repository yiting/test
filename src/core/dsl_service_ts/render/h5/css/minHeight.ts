export default {
  key: 'minHeight',
  value() {
    if (this._hasText && !this._textCanFlex()) {
      return null;
    }

    // let firstChild = this._getFirstChild(this.parent);
    // let firstChild = this._usePaddingTop();
    // if (firstChild) {
    // return Math.abs(this._abYops - firstChild._abY);
    // }
    return Math.abs(this._abYops - this._abY);
  },
};
