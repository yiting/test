import Template from '../template';
import XmlEngine from '../XmlEngine';

export default class HtmlTemplate extends Template {
  constructor(...args: any[]) {
    super(args);
    this._engine = XmlEngine;
    this._template = '';

    // this.requireImgPath = function (path: string) {
    // };
  }
  get width() {
    return this._renderData.abXops - this._renderData.abX;
  }
  get height() {
    return this._renderData.abYops - this._renderData.abY;
  }
  get path() {
    return this._renderData.path;
  }
  get bgColor() {
    if (this._renderData.styles && this._renderData.styles.background) {
      const bg = this._renderData.styles.background;
      const color = bg.color;
      return [
        '0x',
        Math.ceil(color['a'] * 255).toString(16),
        color['r'].toString(16),
        color['g'].toString(16),
        color['b'].toString(16),
      ].join('');
    } else {
      return '';
    }
  }
}
