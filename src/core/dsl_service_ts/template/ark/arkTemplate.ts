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
}
