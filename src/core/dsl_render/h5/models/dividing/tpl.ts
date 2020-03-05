import HtmlTemplate from '../../dom/dom';

export default class Dividing extends HtmlTemplate {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = 'hr';
    this._orignTagName = 'div';
  }
  getUI() {
    return `<div class="${this.htmlClassName}">${this.slot}</div>`;
  }
}
