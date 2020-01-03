import HtmlTemplate from '../../template';

export default class Layer extends HtmlTemplate {
  constructor(dom: any) {
    super(dom);
    this.className = this.layerClassName();
    this.tagName = 'div';
  }
  getUI() {
    return `<div class="${this.classNameChain}">${this.slot}</div>`;
  }
}
