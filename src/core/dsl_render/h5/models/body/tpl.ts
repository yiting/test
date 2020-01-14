import HtmlTemplate from '../../dom/dom';

export default class Body extends HtmlTemplate {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = 'body';
    this._orignTagName = 'div';
  }
  getUI() {
    return `<div class="${this.htmlClassName}" ${this.id}>${this.slot}</div>`;
  }
}
