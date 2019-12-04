import CssDefault from '../model/css_default';
export default {
  key: 'opacity',
  value() {
    const opacity = +this.styles.opacity;
    if (typeof opacity === 'number' && !isNaN(opacity)) {
      return opacity;
    }
    return CssDefault.opacity;
  },
};
