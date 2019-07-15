import Funcs from '../css_func';

export default {
  key: 'fontSize',
  value() {
    if (this.styles && this.styles.texts && this.styles.texts[0]) {
      return Funcs.transUnit(this.styles.texts[0].size);
    }
    return null;
  },
};
