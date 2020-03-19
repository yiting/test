import HtmlDom from '../../dom/dom';

export default class Body extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = 'wrap';
    this._orignTagName = 'div';
  }
  getUI() {
    return `<div class="${this.htmlClassName}">${this.slot}</div>`;
  }
}
