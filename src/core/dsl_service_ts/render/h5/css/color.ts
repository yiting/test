import Funcs from '../css_func';

//
export default {
  key: 'color',
  value() {
    if (this.styles && this.styles.texts) {
      return Funcs.getRGBA(this.styles.texts[0].color);
    }
    return null;
  },
};
