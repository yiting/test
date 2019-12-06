import Utils from '../../../helper/methods';
import Store from '../../../helper/store';
import Dictionary from '../../../helper/dictionary';
import CssProperty from '../utils/css_property';
export default {
  key: 'overflow',
  value(): any {
    if (this.type == Dictionary.type.QBody) {
      return CssProperty.default.overflow;
    }
    const range: any = Utils.calRange(this.children);

    const designWidth = Store.get('designWidth') || 0;
    if (this.width === designWidth && range.width > this.width) {
      return 'auto';
    }
    if (this.styles.texts) {
      return 'hidden';
    }
    return CssProperty.default.overflow;
  },
};
