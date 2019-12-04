import Path from 'path';
import Config from '../../config.json';
import Funcs from '../function/css_func';
import CssDefault from '../model/css_default';

export default {
  key: 'backgroundImage',
  value() {
    if (this._isImgTag()) {
      return CssDefault.backgroundImage;
    }
    if (this._isBgTag()) {
      return CssDefault.backgroundImage;
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
    return CssDefault.backgroundImage;
  },
};
