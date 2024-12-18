import Funcs from '../../utils/css_func';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';

export default {
  key: 'border',
  value() {
    if (this.styles.border && this.styles.border.width) {
      const borderType = Funcs.borderType(this.styles.border.type);
      const borderWidth = Funcs.transUnit(this.styles.border.width);
      const borderColor = Funcs.getRGBA(this.styles.border.color);
      return [borderWidth, borderType, borderColor].join(' ');
    }
    return cssDefaultProperty.border;
  },
};
