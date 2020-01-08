import Funcs from '../utils/css_func';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';

//
export default {
  key: 'color',
  value() {
    if (this.styles && this.styles.texts && this.styles.texts[0]) {
      return Funcs.getRGBA(this.styles.texts[0].color);
    }
    return cssDefaultProperty.color;
  },
};
