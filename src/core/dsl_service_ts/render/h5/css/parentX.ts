export default {
  // 转换过的基于父节点的parentX
  key: 'parentX',
  value() {
    return this._abX - this.parent._abX;
  },
};
