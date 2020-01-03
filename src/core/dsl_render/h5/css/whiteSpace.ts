import Dictionary from '../../../dsl_layout/helper/dictionary';
import { debug } from 'util';
import CssProperty from '../propertyMap';

export default {
  key: 'whiteSpace',
  value() {
    if (this.type != Dictionary.type.QText) {
      return CssProperty.default.whiteSpace;
    }
    const lineHeight =
      this.lineHeight ||
      Math.max(
        ...this.children.map((nd: any) => nd.lineHeight || nd.abYops - nd.abY),
      );
    const _height = this.abYops - this.abY;
    if (_height / lineHeight > 1.2) {
      // 多行
      return CssProperty.default.whiteSpace;
    }
    if (
      this.parent &&
      this.parent.type == Dictionary.type.QText &&
      this.type == Dictionary.type.QText
    ) {
      // emx元素
      return CssProperty.default.whiteSpace;
    }
    return 'nowrap';
    return CssProperty.default.whiteSpace;
  },
};
