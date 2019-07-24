// import Constraints from '../../../helper/constraints';
export default {
  key: 'width',
  value() {
    const _hasWidth = this._hasWidth();
    if (_hasWidth) {
      const width = Math.abs(this.abXops - this.abX);
      const parentWidth =
        this.parent && Math.abs(this.parent.abXops - this.parent.abX);
      return parentWidth === width ? '100%' : width;
    }
    return null;
  },
};
