import Text from '../../../../dsl_extend/models/text/tpl/h5';
import CssDefault from '../model/css_default';
export default {
  key: 'paddingLeft',
  value() {
    // 如果为文本节点
    if (this.modelName == Text.name) {
      return CssDefault.paddingLeft;
    }
    const hasWidth = this._hasWidth();
    const firstChild = this._getFirstChild();
    if (!hasWidth && firstChild) {
      return firstChild.abX - this.abX;
    }
    return CssDefault.paddingLeft;
  },
};
