import Dictionary from '../../../helper/dictionary';
import CssProperty from '../utils/css_property';
export default {
  key: 'display',
  value(): any {
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
      return 'inline-flex';
    }
    if (this.type !== Dictionary.type.QText && this.children.length) {
      return 'flex';
    }
    return CssProperty.default.display;
  },
};
