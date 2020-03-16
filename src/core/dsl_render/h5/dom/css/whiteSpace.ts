import Dictionary from '../../../../dsl_helper/dictionary';
import { debug } from 'util';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';

export default {
  key: 'whiteSpace',
  value() {
    if (this.type != Dictionary.type.QText) {
      return cssDefaultProperty.whiteSpace;
    }
    const lineHeight =
      this.lineHeight ||
      Math.max(
        ...this.children.map((nd: any) => nd.lineHeight || nd.abYops - nd.abY),
      );
    const _height = this.abYops - this.abY;
    if (_height / lineHeight > 1.2) {
      // 多行
      return cssDefaultProperty.whiteSpace;
    }
    if (
      this.parent &&
      this.parent.type == Dictionary.type.QText &&
      this.type == Dictionary.type.QText
    ) {
      // emx元素
      return cssDefaultProperty.whiteSpace;
    }
    return 'nowrap';
    return cssDefaultProperty.whiteSpace;
  },
};
