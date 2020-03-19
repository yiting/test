import HtmlDom from '../../dom/dom';
import Store from '../../../../dsl_helper/store';

export default class Image extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = this.getClassName();
    this._orignTagName = 'div';
  }
  getUI() {
    var attr = this.path ? `style="background-image:url(${this.imgPath})"` : '';
    return `<div class="${this.htmlClassName}" ${attr} >${this.slot}</div>`;
  }
  getClassName() {
    let coordinateWidth = Store.get('coordinateWidth');
    if (this._width < 60 && this._height < 60) {
      return 'icon';
    }
    if (
      this._width / coordinateWidth > 0.8 &&
      this._width / this._height > 1.3
    ) {
      return 'banner';
    }
    return 'image';
  }
}
