import Utils from '../../utils';
import Store from '../../../helper/store';
import Dictionary from '../../../helper/dictionary';
export default {
  key: 'overflow',
  value() {
    if (this.type == Dictionary.type.QBody) {
      return null;
    }
    const range: any = Utils.calRange(this.children);

    const designWidth = Store.get('designWidth') || 0;
    if (this.width === designWidth && range.width > this.width) {
      return 'auto';
    }
    if (this.styles.texts) {
      return 'hidden';
    }
    return null;
  },
};
