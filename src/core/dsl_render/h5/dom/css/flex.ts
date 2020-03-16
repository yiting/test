import { defaultProperty as cssDefaultProperty } from '../propertyMap';
export default {
  key: 'flex',
  value() {
    if (this.width !== cssDefaultProperty.width && this._isParentHorizontal()) {
      return 'none';
    }
    return cssDefaultProperty.flex;
  },
};
