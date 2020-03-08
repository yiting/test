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
      let isBlockOfParent =
        this.parent && this.parent.display === cssDefaultProperty.display;
      let isSameWidthOfParent = parentWidth === width;
      return isBlockOfParent && isSameWidthOfParent
        ? cssDefaultProperty.width
        : width;
    }
    return cssDefaultProperty.width;
  },
};
