import HtmlTemplate from '../../../../dsl_render/h5/template';

class Text extends HtmlTemplate {
  constructor(dom: any) {
    super(dom);
    this.className = this.textClassName();
    this.tagName = 'span';
  }
  getUI() {
    return `<span class="${this.classNameChain}">${this.text}${
      this.slot
    }</span>`;
  }
}

export default Text;
