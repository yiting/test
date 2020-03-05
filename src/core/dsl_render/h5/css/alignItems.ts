import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
const flexValue: any = {
  Start: 'flex-start',
  End: 'flex-end',
  Center: 'center',
};

export default {
  key: 'alignItems',
  value() {
    const that: any = this;
    if (this.display === 'flex' || this.display === 'inline-flex') {
      return (
        flexValue[that.constraints.LayoutAlignItems] ||
        cssDefaultProperty.alignItems
      );
    }
    return cssDefaultProperty.alignItems;
  },
};
