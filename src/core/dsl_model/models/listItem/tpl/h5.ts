import HtmlTemplate from '../../../../dsl_render/h5/template';

export default class ListItem extends HtmlTemplate {
  constructor(dom: any) {
    super(dom);
    this.className = 'list-item';
    this.tagName = 'li';
  }
  getUI() {
    return `<li class="${this.classNameChain}">${this.slot}</li>`;
  }
}
