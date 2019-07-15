export default {
  key: 'fontFamily',
  value() {
    if (this.styles.texts && this.styles.texts[0]) {
      return this.styles.texts[0].font;
    }
    return null;
  },
};
