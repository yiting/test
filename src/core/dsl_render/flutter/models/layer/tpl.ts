import FlutterTemplate from '../../template';

export default class Layer extends FlutterTemplate {
  constructor(dom: any) {
    super(dom);
  }
  getUI() {
    return `<div class="">${this.slot}</div>`;
  }
}
