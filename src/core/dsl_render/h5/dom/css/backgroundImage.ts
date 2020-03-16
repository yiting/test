import Path from 'path';
import Config from '../../../config.json';
import Funcs from '../../utils/css_func';
import { defaultProperty as cssDefaultProperty } from '../propertyMap';

export default {
  key: 'backgroundImage',
  value() {
    if (this.styles.background && this.styles.background.type === 'linear') {
      return Funcs.getLinearGradient(
        this.styles.background,
        this.abXops - this.abX,
        this.abYops - this.abY,
      );
    }
    return cssDefaultProperty.backgroundImage;
  },
};
