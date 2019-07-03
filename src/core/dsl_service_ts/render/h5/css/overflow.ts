import Utils from '../../utils';
import Store from '../../../helper/store';
export default {
  key: 'overflow',
  value() {
    // if(this.children)
    const range: any = Utils.calRange(this.children);

    const OptimizeWidth = Store.get('optimizeWidth') || 0;
    if (this.width === OptimizeWidth && range.width > this.width) {
      return 'auto';
    }
    if (this.styles.texts) {
      return 'hidden';
    }
    return null;
  },
};
