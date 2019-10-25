import Text from '../../../../dsl_extend/models/text/tpl/h5';
export default {
  key: 'paddingTop',
  value() {
    // 如果为文本节点
    if (this.modelName == Text.name) {
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
