export default {
  key: 'flex',
  value() {
    if (this._hasWidth()) {
      return 'none';
    }
    return null;
  },
};
