export default {
  key: 'opacity',
  value() {
    if (typeof this.styles.opacity === 'number') {
      return this.styles.opacity;
    }
    return null;
  },
};
