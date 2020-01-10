import Dom from '../../dom/dom';

export default class Image extends Dom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
  }
  getUI() {
    return `Image:${this.path}
    ${this.slot}`;
  }
}
