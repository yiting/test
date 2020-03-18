import Dictionary from '../../../../dsl_helper/dictionary';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';
import Constraints from '../../../../dsl_helper/constraints';

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
      return 'inline-flex';
    }
    if (this.parent && this.parent.type === Dictionary.type.QText) {
      return 'inline-flex';
    }
    if (
      this.type !== Dictionary.type.QText &&
      this.constraints.LayoutDirection ===
        Constraints.LayoutDirection.Horizontal
    ) {
      return 'flex';
    }
    return cssDefaultProperty.display;
  },
};
