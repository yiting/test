import CssProperty from '../utils/css_property';
export default {
  key: 'opacity',
  value(): any {
    const opacity = +this.styles.opacity;
    if (typeof opacity === 'number' && !isNaN(opacity)) {
      return opacity;
    }
    return CssProperty.default.opacity;
  },
};
