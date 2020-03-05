import { defaultProperty as cssDefaultProperty } from '../dom/propertyMap';
import paddingTop from './paddingTop';
import paddingBottom from './paddingBottom';
export default {
  key: 'boxSizing',
  value() {
    let has_border = this.styles.border && this.styles.border.width;
    let has_paddingTop = paddingTop.value.call(this);
    let has_paddingBottom = paddingBottom.value.call(this);
    if (has_border || has_paddingTop || has_paddingBottom) {
      return 'border-box';
    }
    return cssDefaultProperty.boxSizing;
  },
};
