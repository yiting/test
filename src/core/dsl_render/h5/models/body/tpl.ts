import HtmlTemplate from '../../template';

export default class Body extends HtmlTemplate {
  constructor(dom: any) {
    super(dom);
    this.className = 'section';
    this.tagName = 'div';
  }
  getUI() {
    return `<div class="${this.classNameChain}">${this.slot}</div>`;
  }
}
