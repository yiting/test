export default {
  key: 'textOverflow',
  value() {
    if (this.styles.texts) {
      return 'ellipsis';
    }
    return null;
  },
};
