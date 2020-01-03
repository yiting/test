import HtmlTemplate from '../../../../dsl_render/h5/template';

class Inline extends HtmlTemplate {
  constructor(dom: any) {
    super(dom);
    this.className = 'inline';
    this.tagName = 'span';
  }
  getUI() {
    return `<span class="${this.classNameChain}">${this.slot}</span>`;
  }
}

export default Inline;
