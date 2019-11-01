import Template from '../template';
import XmlEngine from '../XmlEngine';
import Utils from '../../helper/methods';

export default class HtmlTemplate extends Template {
  constructor(...args: any[]) {
    super(args);
    this._engine = XmlEngine;
    this._template = '';
    // this.requireImgPath = function (path: string) {
    // };
  }
  get width() {
    return (this._renderData.abXops - this._renderData.abX) / 2;
  }
  get height() {
    return (this._renderData.abYops - this._renderData.abY) / 2;
  }
  get path() {
    if (this._renderData.path) {
      return `res/${this._renderData.path}`;
    } else {
      return null;
    }
  }
  get text() {
    return this._renderData.text.replace(/\n/gim, '');
  }
  get multiline() {
    return this._renderData.multiline;
  }
  get textColor() {
    // 样式修改
    if (
      this._renderData.styles &&
      this._renderData.styles.texts &&
      this._renderData.styles.texts[0].color
    ) {
      return Utils.RGB2HEX(this._renderData.styles.texts[0].color);
    }
  }
  get font() {
    if (this._renderData.styles && this._renderData.styles.texts) {
      return this._renderData.styles.texts[0];
    }
  }
  get textSize() {
    if (
      this._renderData.styles &&
      this._renderData.styles.texts &&
      this._renderData.styles.texts[0].size
    ) {
      return this._renderData.styles.texts[0].size / 2;
    }
  }
  get bgColor() {
    if (this._renderData.styles && this._renderData.styles.background) {
      const bg = this._renderData.styles.background;
      return Utils.RGB2HEX(bg.color);
    }
  }
}
