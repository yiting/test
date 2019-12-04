import CssDefault from '../model/css_default';
const flexValue: any = {
  Start: 'flex-start',
  End: 'flex-end',
  Center: 'center',
};

export default {
  key: 'alignItems',
  value() {
    const that: any = this;
    if (this.display === 'flex') {
      return (
        flexValue[that.constraints.LayoutAlignItems] || CssDefault.alignItems
      );
    }
    return CssDefault.alignItems;
  },
};
