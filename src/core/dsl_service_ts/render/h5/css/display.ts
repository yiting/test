export default {
  key: 'display',
  value() {
    /* if (this._isParentVertical()) {
      return 'block';
    } */
    if (this.children.length) {
      return 'flex';
    }
    return 'block';
  },
};
