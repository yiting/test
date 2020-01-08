import HtmlTemplate from '../../dom/dom';

export default class Image extends HtmlTemplate {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = 'img';
    this._orignTagName = 'div';
  }
  getUI() {
    if (this.children.length) {
      return `<div class="${this.htmlClassName}">${this.slot}</div>`;
    } else {
      return `<div class="${this.htmlClassName}" style="background-image:url(${
        this.imgPath
      })"></div>`;
    }
  }
}
