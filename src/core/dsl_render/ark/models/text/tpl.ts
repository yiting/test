import ArkDom from '../../dom/dom';
import Resource from '../../resource';

export default class Text extends ArkDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
  }
  getUI() {
    let tpl = `<Text value="${this.text}" size="${this.size}" margin="${
      this.margin
    }" anchors="${this.anchors}" multiline="${this.multiline}" align="${
      this.align
    }"`;
    if (this.textColor) {
      tpl += ` textcolor="${this.textColor}"`;
    }
    if (this.textSize) {
      const name = Resource.fontName(this.font);
      tpl += ` font="${name}"`;
    }
    tpl += `></Text>`;
    return tpl;
  }
}
