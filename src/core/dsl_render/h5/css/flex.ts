import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'flex',
  value() {
    if (this.width !== cssDefaultProperty.width && this._isParentHorizontal()) {
      return 'none';
    }
    return cssDefaultProperty.flex;
  },
};
