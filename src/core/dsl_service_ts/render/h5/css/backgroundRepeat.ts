export default {
  key: 'backgroundRepeat',
  value() {
    if (this._isImgTag()) {
      return null;
    }
    let css = null;
    if (this.path) {
      css = 'no-repeat';
    }
    return css;
  },
};
