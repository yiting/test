import Funcs from '../utils/css_func';
import CssProperty from '../utils/css_property';

export default {
  key: 'fontSize',
  value() {
    if (this.styles && this.styles.texts && this.styles.texts[0]) {
      return Funcs.transUnit(this.styles.texts[0].size);
    }
    return CssProperty.default.fontSize;
  },
};
