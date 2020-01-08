import FlutterTemplate from '../../dom/dom';

export default class Text extends FlutterTemplate {
  constructor(dom: any, parent: any) {
    super(dom, parent);
  }
  getUI() {
    return `<div class="">${this.slot}</div>`;
  }
}
