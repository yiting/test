// 转换过的基于父节点的parentY
export default {
  key: 'parentY',
  value() {
    return this._abY - this.parent._abY;
  },
};
