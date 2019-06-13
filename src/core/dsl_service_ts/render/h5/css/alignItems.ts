export default {
  key: 'alignItems',
  value() {
    const that: any = this;
    const m: any = {
      Start: 'flex-start',
      End: 'flex-end',
      Center: 'center',
    };
    return m[that.constraints.LayoutAlignItems] || null;
  },
};
