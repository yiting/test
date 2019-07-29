import ArkTemplate from '../../arkTemplate';
import Resource from '../../../../render/ark/resource';

class EM1M1 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    let tpl = `<Text size="${this.width},${this.height}" value="${
      this.text
    }" size margin anchors multiline align`;
    if (this.textColor) {
      tpl += ` textcolor="${this.textColor}"`;
    }
    if (this.textSize) {
      const name = Resource.fontName(this.font);
      tpl += ` font="${name}"`;
    }
    tpl += `></Text>`;
    this._template = tpl;
  }
}

export default EM1M1;
