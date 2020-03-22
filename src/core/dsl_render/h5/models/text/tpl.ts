import HtmlDom from '../../dom/dom';

export default class Text extends HtmlDom {
  display: any;
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
  textClassName(): string {
    let fontSize = this.styles.texts[0].size;
    if (fontSize >= 30) {
      return 'title';
    }
    if (this.isMultiline) {
      return 'content';
    }
    if (fontSize <= 22) {
      return 'subtext';
    }
    return 'text';
  }
}
