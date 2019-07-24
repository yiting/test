export default {
  // 转换过的基于父节点的parentX
  key: 'parentX',
  value() {
    return this.abX - this.parent.abX;
  },
};
