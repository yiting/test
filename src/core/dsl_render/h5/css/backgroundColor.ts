import CssProperty from '../propertyMap';
import Funcs from '../utils/css_func';

export default {
  key: 'backgroundColor',
  value() {
    if (this._isImgTag()) {
      return CssProperty.default.backgroundColor;
    }
    if (
      this.styles &&
      this.styles.background &&
      this.styles.background.type === 'color'
    ) {
      return Funcs.getRGBA(this.styles.background.color);
    }
    return CssProperty.default.backgroundColor;
  },
};
