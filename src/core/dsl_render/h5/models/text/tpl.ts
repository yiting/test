import HtmlTemplate from '../../dom/dom';

export default class Text extends HtmlTemplate {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = this.textClassName();
    this._orignTagName = 'span';
  }
  getUI() {
    return `<span class="${this.htmlClassName}">${this.text}${
      this.slot
    }</span>`;
  }
}
