import Path from 'path';
import Config from '../../config.json';
import Funcs from '../utils/css_func';
import CssProperty from '../propertyMap';

export default {
  key: 'backgroundImage',
  value() {
    if (this._isImgTag()) {
      return CssProperty.default.backgroundImage;
    }
    if (this._isBgTag()) {
      return CssProperty.default.backgroundImage;
    }
    if (this.styles.background && this.styles.background.type === 'linear') {
      return Funcs.getLinearGradient(
        this.styles.background,
        this.abXops - this.abX,
        this.abYops - this.abY,
      );
    }
    if (this.path) {
      // const path = this.path.replace(/.*?(?=[^/]+$)/gi, '');
      const path = this.path.split('/').pop();
      // const path = this.path.replace(/^.*\//gi, '');
      // const relativePath = Path.relative(
      //   Config.HTML.output.cssPath,
      //   Config.HTML.output.imgPath,
      // );
      return `url(../images/${path})`;
    }
    return CssProperty.default.backgroundImage;
  },
};
