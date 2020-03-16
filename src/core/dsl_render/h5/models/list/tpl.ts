import HtmlDom from '../../dom/dom';

export default class List extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = 'list';
    this._orignTagName = 'ul';
  }
  getUI() {
    return `<ul class="${this.htmlClassName}">${this.slot}</ul>`;
  }
}
