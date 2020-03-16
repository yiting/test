import Constraints from '../../../../dsl_helper/constraints';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';

export default {
  key: 'textAlign',
  value() {
    if (this.display == 'flex' || this.display == 'inline-flex') {
      return cssDefaultProperty.textAlign;
    }
    if (
      this.constraints.LayoutDirection !==
      Constraints.LayoutDirection.Horizontal
    ) {
      return cssDefaultProperty.textAlign;
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
