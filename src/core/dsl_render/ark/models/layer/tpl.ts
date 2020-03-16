import ArkDom from '../../dom/dom';

export default class Layer extends ArkDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
  }
  getUI() {
    let tpl = `<View size="${this.size}" margin="${this.margin}" anchors="${
      this.anchors
    }" radius="${this.radius}">`;
    if (this.relPath) {
      tpl += `<Image size="${this.size}" value="${this.relPath}" margin="${
        this.margin
      }" anchors="${this.anchors}" radius="${this.radius}"/>`;
    } else if (this.bgColor) {
      tpl += `<Texture color="${this.bgColor}"  margin="${
        this.margin
      }" anchors="${this.anchors}" radius="${this.radius}"/>`;
    }
    tpl += this.slot + `</View>`;
    return tpl;
  }
}
