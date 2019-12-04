import Funcs from '../function/css_func';
import CssDefault from '../model/css_default';

export default {
  key: 'border',
  value() {
    if (this.styles.border && this.styles.border.width) {
      const borderType = Funcs.borderType(this.styles.border.type);
      const borderWidth = Funcs.transUnit(this.styles.border.width);
      const borderColor = Funcs.getRGBA(this.styles.border.color);
      return [borderWidth, borderType, borderColor].join(' ');
    }
    return CssDefault.border;
  },
};
