import Constraints from '../../../helper/constraints';
export default {
  key: 'textAlign',
  value() {
    if (this.display == 'flex') {
      return null;
    }
    if (
      this.constraints.LayoutDirection !==
      Constraints.LayoutDirection.Horizontal
    ) {
      return;
    }
    let textAlign = this.styles.textAlign;
    let justifyContent = this.constraints.LayoutJustifyContent;
    if (
      textAlign == 2 ||
      justifyContent === Constraints.LayoutJustifyContent.Center
    ) {
      return 'center';
    } else if (
      textAlign == 0 ||
      justifyContent === Constraints.LayoutJustifyContent.Start
    ) {
      return 'left';
    } else if (
      textAlign == 1 ||
      justifyContent === Constraints.LayoutJustifyContent.End
    ) {
      return 'right';
    }
  },
};
