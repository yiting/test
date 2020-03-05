import HtmlTemplate from '../../dom/dom';

export default class ListItem extends HtmlTemplate {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = 'list-item';
    this._orignTagName = 'li';
  }
  getUI() {
    return `<li class="${this.htmlClassName}">${this.slot}</li>`;
  }
}
