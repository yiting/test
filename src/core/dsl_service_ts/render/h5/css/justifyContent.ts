export default {
  key: 'justifyContent',
  value() {
    const m: any = {
      Start: 'flex-start',
      End: 'flex-end',
      Center: 'center',
    };
    return m[this.constraints.LayoutJustifyContent] || null;
  },
};
