import Funcs from '../utils/css_func';
import CssProperty from '../utils/css_property';

//
export default {
  key: 'color',
  value() {
    if (this.styles && this.styles.texts && this.styles.texts[0]) {
      return Funcs.getRGBA(this.styles.texts[0].color);
    }
    return CssProperty.default.color;
  },
};
