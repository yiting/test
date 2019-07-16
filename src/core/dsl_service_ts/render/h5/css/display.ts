import Common from '../../../dsl2/common';
export default {
  key: 'display',
  value() {
    if (
      this.parent &&
      this.parent.type === Common.QText &&
      this.type === Common.QText &&
      this._hasText
    ) {
      // 如果当前节点为文本
      return 'inline';
    }
    if (this.parent && this.parent.type === Common.QText) {
      return 'inline-block';
    }
    // if (this.children.length == 1 && this.children[0].type == Common.QText) {
    //   // 如果为文本容器
    //   return 'block'
    // }
    if (this.type !== Common.QText && this.children.length) {
      return 'flex';
    }
    return 'block';
  },
};
