export default {
  key: 'backgroundSize',
  value() {
    if (this._isImgTag()) {
      return null;
    }
    if (this.path) {
      return 'contain';
    }
    return null;
  },
};
