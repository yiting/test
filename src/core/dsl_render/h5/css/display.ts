import Dictionary from '../../../dsl_layout/helper/dictionary';
import CssProperty from '../propertyMap';
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
