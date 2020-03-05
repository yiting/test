import Dom from '../../dom/dom';

export default class Body extends Dom {
  size: any;
  constructor(dom: any, parent: any) {
    super(dom, parent);
  }
  getUI() {
    return `Body:${this.size}
      ${this.slot}`;
  }
}
