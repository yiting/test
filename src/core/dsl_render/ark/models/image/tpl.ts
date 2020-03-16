import ArkDom from '../../dom/dom';

export default class Image extends ArkDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
  }
  getUI() {
    var tpl = '';
    if (this.relPath) {
      tpl = `<Image size="${this.size}" value="${this.relPath}"  margin="${
        this.margin
      }" anchors="${this.anchors}" radius="${this.radius}"/>`;
    } else {
      tpl = `<Texture size="${this.size}" color="${this.bgColor}"  margin="${
        this.margin
      }" anchors="${this.anchors}"/>`;
    }
    return tpl;
  }
}
