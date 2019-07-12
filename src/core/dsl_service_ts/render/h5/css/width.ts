// import Constraints from '../../../helper/constraints';
export default {
  key: 'width',
  value() {
    // let constraints: any = this.constraints;
    const _hasWidth = this._hasWidth();
    if (_hasWidth) {
      return Math.abs(this._abXops - this._abX);
    }
    return null;
  },
};
