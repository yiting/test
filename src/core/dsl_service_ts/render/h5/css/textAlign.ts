import Constraints from '../../../helper/constraints';
import CssProperty from '../utils/css_property';
export default {
  key: 'textAlign',
  value() {
    if (this.display == 'flex') {
      return CssProperty.default.textAlign;
    }
    if (
      this.constraints.LayoutDirection !==
      Constraints.LayoutDirection.Horizontal
    ) {
      return CssProperty.default.textAlign;
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
