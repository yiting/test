import Common from '../../../dsl2/common';
export default {
  key: 'display',
  value() {
    const hasText = this.text;
    if (
      this.parent &&
      this.parent.type === Common.QText &&
      this.type === Common.QText &&
      hasText
    ) {
      return 'inline';
    }
    if (this.parent && this.parent.type === Common.QText) {
      return 'inline-block';
    }
    if (this.type !== Common.QText && this.children.length) {
      return 'flex';
    }
    return 'block';
  },
};
