import Dom from '../../dom/dom';

export default class Text extends Dom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
  }
  getUI() {
    return `Text:${this.text}
    ${this.slot}`;
  }
}
