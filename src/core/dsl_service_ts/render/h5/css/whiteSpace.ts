import Common from '../../../dsl2/common';

export default {
  key: 'whiteSpace',
  value() {
    if (this.type != Common.QText) {
      return null;
    }
    const lineHeight =
      this.lineHeight ||
      Math.max(...this.children.map((nd: any) => nd.lineHeight || nd._height));
    if (this._height / lineHeight > 1.2) {
      // 多行
      return null;
    }
    if (
      this.parent &&
      this.parent.type == Common.QText &&
      this.type == Common.QText
    ) {
      // emx元素
      return null;
    }
    return 'nowrap';
  },
};
