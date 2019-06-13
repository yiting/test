import Utils from '../../utils';

export default {
  key: 'overflow',
  value() {
    // if(this.children)
    const range: any = Utils.calRange(this.children);
    if (this.width === 750 && range.width > this.width) {
      return 'auto';
    }
    if (this.styles.texts) {
      return 'hidden';
    }
    return null;
  },
};
