import CssProperty from '../utils/css_property';
export default {
  key: 'lineHeight',
  value() {
    if (this.styles.texts && this.styles.texts.length) {
      // 清洗行高，本应由数据源清洗
      const _height = this.abYops - this.abY;
      const maxSize = Math.max(...this.styles.texts.map((t: any) => t.size));
      const onlyOneLine = _height / maxSize < 1.2;
      return this.styles.lineHeight || (onlyOneLine ? _height : maxSize * 1.4);
    }
    return CssProperty.default.lineHeight;
  },
};
