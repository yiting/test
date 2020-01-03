import HtmlTemplate from '../../template';

export default class List extends HtmlTemplate {
  constructor(dom: any) {
    super(dom);
    this.className = 'list';
    this.tagName = 'ul';
  }
  getUI() {
    return `<ul class="${this.classNameChain}">${this.slot}</ul>`;
  }
}
