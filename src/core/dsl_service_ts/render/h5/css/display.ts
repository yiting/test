import Dictionary from '../../../helper/dictionary';
export default {
  key: 'display',
  value() {
    const hasText = this.text;
    if (
      this.parent &&
      this.parent.type === Dictionary.type.QText &&
      this.type === Dictionary.type.QText &&
      hasText
    ) {
      return 'inline';
    }
    if (this.parent && this.parent.type === Dictionary.type.QText) {
      return 'inline-block';
    }
    if (this.type !== Dictionary.type.QText && this.children.length) {
      return 'flex';
    }
    return 'block';
  },
};
