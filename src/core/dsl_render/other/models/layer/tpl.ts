import Dom from '../../dom/dom';

export default class Layer extends Dom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
  }
  getUI() {
    return `Layer:
      ${this.slot}`;
  }
}
