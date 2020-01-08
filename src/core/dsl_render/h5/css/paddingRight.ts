import Text from '../models/text/tpl';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
export default {
  key: 'paddingRight',
  value() {
    // 如果为文本节点
    // if (this.parent && this.parent.modelName == 'em1-m1') {
    //   return null;
    // }
    if (this.modelName == Text.name) {
      return cssDefaultProperty.paddingRight;
    }
    const hasWidth = this._hasWidth();
    const lastChild = this._getLastChild();
    if (!hasWidth && lastChild) {
      return this.abXops - lastChild.abXops;
    }
    return cssDefaultProperty.paddingRight;
  },
};
