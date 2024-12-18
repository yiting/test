import Text from '../../models/text/tpl';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';
export default {
  key: 'paddingLeft',
  value() {
    // 如果为文本节点
    if (this.modelName == Text.name) {
      return cssDefaultProperty.paddingLeft;
    }
    const hasWidth = this._hasWidth();
    const firstChild = this._getFirstChild();
    if (!hasWidth && firstChild) {
      return firstChild.abX - this.abX;
    }
    return cssDefaultProperty.paddingLeft;
  },
};
