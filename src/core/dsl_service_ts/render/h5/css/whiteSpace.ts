import Dictionary from '../../../helper/dictionary';
import { debug } from 'util';
import CssDefault from '../model/css_default';

export default {
  key: 'whiteSpace',
  value() {
    if (this.type != Dictionary.type.QText) {
      return null;
    }
    const lineHeight =
      this.lineHeight ||
      Math.max(
        ...this.children.map((nd: any) => nd.lineHeight || nd.abYops - nd.abY),
      );
    const _height = this.abYops - this.abY;
    if (_height / lineHeight > 1.2) {
      // 多行
      return null;
    }
    if (
      this.parent &&
      this.parent.type == Dictionary.type.QText &&
      this.type == Dictionary.type.QText
    ) {
      // emx元素
      return null;
    }
    // return 'nowrap';
    return CssDefault.whiteSpace;
  },
};
