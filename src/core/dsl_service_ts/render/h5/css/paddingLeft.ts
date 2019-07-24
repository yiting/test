export default {
  key: 'paddingLeft',
  value() {
    // 如果为文本节点子节点
    if (this.parent && this.parent.modelName == 'em1-m1') {
      return null;
    }
    const hasWidth = this._hasWidth();
    const firstChild = this._getFirstChild();
    if (!hasWidth && firstChild) {
      return firstChild.abX - this.abX;
    }
    return null;
  },
};
