// import Constraints from '../../../helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
import display from './display';
export default {
  key: 'width',
  value() {
    let _hasWidth = this._hasWidth();
    if (_hasWidth) {
      let width = Math.abs(this.abXops - this.abX);
      let parentWidth =
        this.parent && Math.abs(this.parent.abXops - this.parent.abX);
      return parentWidth === width ? cssDefaultProperty.width : width;
    }
    return cssDefaultProperty.width;
  },
};
