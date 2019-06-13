import Funcs from '../css_func';

export default {
  key: 'backgroundColor',
  value() {
    if (this._isImgTag()) {
      return null;
    }
    if (
      this.styles &&
      this.styles.background &&
      this.styles.background.type === 'color'
    ) {
      return Funcs.getRGBA(this.styles.background.color);
    }
    return null;
  },
};
