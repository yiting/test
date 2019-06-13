export default {
  key: 'fontFamily',
  value() {
    if (this.styles.texts) {
      return this.styles.texts[0].font;
    }
    return null;
  },
};
