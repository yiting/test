import Utils from '../../../helper/methods';
import Store from '../../../helper/store';
import Dictionary from '../../../helper/dictionary';
import CssDefault from '../model/css_default';
export default {
  key: 'overflow',
  value() {
    if (this.type == Dictionary.type.QBody) {
      return CssDefault.overflow;
    }
    const range: any = Utils.calRange(this.children);

    const designWidth = Store.get('designWidth') || 0;
    if (this.width === designWidth && range.width > this.width) {
      return 'auto';
    }
    if (this.styles.texts) {
      return 'hidden';
    }
    return CssDefault.overflow;
  },
};
