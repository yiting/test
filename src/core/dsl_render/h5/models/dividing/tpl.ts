import HtmlTemplate from '../../template';

export default class Dividing extends HtmlTemplate {
  constructor(dom: any) {
    super(dom);
    this.className = 'hr';
    this.tagName = 'div';
  }
  getUI() {
    return `<div class="${this.classNameChain}">${this.slot}</div>`;
  }
}
