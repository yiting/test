import Text from '../../../../dsl_extend/models/text/tpl/h5';
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
