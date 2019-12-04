import Funcs from '../function/css_func';
import CssDefault from '../model/css_default';

//
export default {
  key: 'color',
  value() {
    if (this.styles && this.styles.texts && this.styles.texts[0]) {
      return Funcs.getRGBA(this.styles.texts[0].color);
    }
    return CssDefault.color;
  },
};
