import Funcs from '../function/css_func';
import CssDefault from '../model/css_default';

export default {
  key: 'fontSize',
  value() {
    if (this.styles && this.styles.texts && this.styles.texts[0]) {
      return Funcs.transUnit(this.styles.texts[0].size);
    }
    return CssDefault.fontSize;
  },
};
