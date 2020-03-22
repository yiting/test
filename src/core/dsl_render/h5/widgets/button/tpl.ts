import HtmlDom from '../../dom/dom';

class Button extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = 'button';
    this._orignTagName = 'div';
  }
  getUI() {
    return `<div class="${this.htmlClassName}">${this.text}</div>`;
  }
  getExtendCss() {
    return `.${this._classNameChain}:active{opacity: .8;}`;
  }
}

export default Button;
