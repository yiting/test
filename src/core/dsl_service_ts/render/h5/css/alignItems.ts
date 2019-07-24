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
      return flexValue[that.constraints.LayoutAlignItems] || null;
    } else {
      return null;
    }
  },
};
