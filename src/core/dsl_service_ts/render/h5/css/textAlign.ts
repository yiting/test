export default {
  key: 'textAlign',
  value() {
    if (this._isTextCenter()) {
      return 'center';
    }
    return null;
  },
};
