import Dictionary from '../../../helper/dictionary';
import CssDefault from '../model/css_default';
export default {
  key: 'display',
  value() {
    const hasText = this.text;
    if (
      hasText &&
      this.parent &&
      this.parent.type === Dictionary.type.QText &&
      this.type === Dictionary.type.QText
    ) {
      return 'inline';
    }
    if (this.parent && this.parent.type === Dictionary.type.QText) {
      return 'inline-block';
    }
    if (this.type !== Dictionary.type.QText && this.children.length) {
      return 'flex';
    }
    return CssDefault.display;
  },
};
