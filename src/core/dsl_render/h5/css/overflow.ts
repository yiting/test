import Utils from '../../../dsl_layout/helper/methods';
import Store from '../../../dsl_layout/helper/store';
import Dictionary from '../../../dsl_layout/helper/dictionary';
import CssProperty from '../propertyMap';
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
