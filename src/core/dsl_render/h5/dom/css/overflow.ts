import Utils from '../../../../dsl_helper/methods';
import Store from '../../../../dsl_helper/store';
import Dictionary from '../../../../dsl_helper/dictionary';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';
export default {
  key: 'overflow',
  value(): any {
    if (this.type == Dictionary.type.QBody) {
      return cssDefaultProperty.overflow;
    }
    const range: any = Utils.calRange(this.children);

    const designWidth = Store.get('designWidth') || 0;
    if (this._width === designWidth && range.width > this._width) {
      return 'auto';
    }
    if (this.styles.texts) {
      return 'hidden';
    }
    return cssDefaultProperty.overflow;
  },
};
