import HtmlDom from '../../dom/dom';

class Inline extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = 'inline';
    this._orignTagName = 'span';
  }
  getUI() {
    return `<span class="${this.htmlClassName}">${this.slot}</span>`;
  }
}

export default Inline;
