import Path from 'path';
import Config from '../../config.json';
import Funcs from '../css_func';

export default {
  key: 'backgroundImage',
  value() {
    if (this._isImgTag()) {
      return null;
    }
    if (this._isBgTag()) {
      return null;
    }
    if (this.styles.background && this.styles.background.type === 'linear') {
      return Funcs.getLinearGradient(
        this.styles.background,
        this.abXops - this.abX,
        this.abYops - this.abY,
      );
    }
    if (this.path) {
      const relativePath = Path.relative(
        Config.HTML.output.cssPath,
        Config.HTML.output.imgPath,
      );
      return `url(./${relativePath}/${this.path})`;
    }
    return null;
  },
};
