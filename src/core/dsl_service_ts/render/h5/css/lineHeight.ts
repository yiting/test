export default {
  key: 'lineHeight',
  value() {
    if (this._hasText) {
      // 清洗行高，本应由数据源清洗
      const maxSize = Math.max(...this.styles.texts.map((t: any) => t.size));
      const onlyOneLine = this._height / maxSize < 1.2;
      return (
        this.styles.lineHeight || (onlyOneLine ? this._height : maxSize * 1.4)
      );
    }
    return null;
  },
};
