export default {
  key: 'paddingTop',
  value() {
    // 如果为文本节点
    if (this.modelName == 'em1-m1') {
      return null;
    }
    // let firstChild = this._getFirstChild(this);
    const firstChild = this._usePaddingTop();
    if (firstChild) {
      return firstChild.abY - this.abY;
    }
    return null;
  },
};
