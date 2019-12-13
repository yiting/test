import CssProperty from '../utils/css_property';
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
        flexValue[that.constraints.LayoutAlignItems] ||
        CssProperty.default.alignItems
      );
    }
    return CssProperty.default.alignItems;
  },
};
