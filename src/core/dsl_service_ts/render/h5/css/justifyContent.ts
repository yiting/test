const flexValue: any = {
  Start: 'flex-start',
  End: 'flex-end',
  Center: 'center',
};

export default {
  key: 'justifyContent',
  value() {
    if (this.display === 'flex') {
      return flexValue[this.constraints.LayoutJustifyContent] || null;
    } else {
      return null;
    }
  },
};
