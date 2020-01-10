import VDom from '../../vdom';

export default class Dom extends VDom {
  constructor(node: any, parent: any) {
    super(node, parent);
  }
  get size() {
    return `${this.abXops - this.abX},${this.abYops - this.abY}`;
  }
}
