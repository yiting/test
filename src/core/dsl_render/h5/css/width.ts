// import Constraints from '../../../helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
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
    return cssDefaultProperty.width;
  },
};
