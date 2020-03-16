import HtmlDom from '../../dom/dom';

export default class Layer extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = this.layerClassName();
    this._orignTagName = 'div';
  }
  getUI() {
    return `<div class="${this.htmlClassName}">${this.slot}</div>`;
  }
}
