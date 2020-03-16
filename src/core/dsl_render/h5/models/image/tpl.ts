import HtmlDom from '../../dom/dom';

export default class Image extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = getClassName(this);
    this._orignTagName = 'div';
  }
  getUI() {
    if (this.path) {
      return `<div class="${this.htmlClassName}" style="background-image:url(${
        this.imgPath
      })">${this.slot}</div>`;
    } else {
      return `<div class="${this.htmlClassName}" >${this.slot}</div>`;
    }
  }
}
function getClassName(dom: any) {
  if (dom._width < 60 && dom._height < 60) {
    return 'icon';
  }
  return 'img';
}
