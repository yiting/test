import HtmlTemplate from '../../dom/dom';

export default class Text extends HtmlTemplate {
  display: any;
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = this.textClassName();
    this._orignTagName = 'span';
  }
  getUI() {
    return `<span class="${this.htmlClassName}" ${this.id}>${this.text}${
      this.slot
    }</span>`;
  }
}
