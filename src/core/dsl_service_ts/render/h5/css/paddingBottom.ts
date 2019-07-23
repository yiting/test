import Constraints from '../../../helper/constraints';
export default {
  key: 'paddingBottom',
  value() {
    // 如果为文本节点子节点
    if (this.parent && this.parent.modelName == 'em1-m1') {
      return null;
    }
    if (this._hasHeight()) {
      return null;
    }
    let minPaddingBottom: number | null = null;
    const that = this;
    this.children.forEach((cssDom: any) => {
      if (
        cssDom.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute
      ) {
        const pd = that.abYops - cssDom.abYops;
        minPaddingBottom =
          pd >= 0 && (minPaddingBottom === null || minPaddingBottom > pd)
            ? pd
            : minPaddingBottom;
      }
    });
    return minPaddingBottom;
  },
};
