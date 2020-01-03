import HtmlTemplate from '../../../../dsl_render/h5/template';

export default class Image extends HtmlTemplate {
  constructor(dom: any) {
    super(dom);
    this.className = 'img';
    this.tagName = 'div';
  }
  getUI() {
    if (this.dom.children.length) {
      return `<div class="${this.classNameChain}">${this.slot}</div>`;
    } else {
      return `<div class="${this.classNameChain}" style="background-image:url(${
        this.imgPath
      })"></div>`;
    }
  }
}
