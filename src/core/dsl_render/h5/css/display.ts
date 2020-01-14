import Dictionary from '../../../dsl_layout/helper/dictionary';
import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
import Constraints from '../../../dsl_layout/helper/constraints';

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
