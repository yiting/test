import Text from '../../../template/html/base/text';
export default {
  key: 'paddingLeft',
  value() {
    // 如果为文本节点
    if (this.modelName == Text.name) {
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
