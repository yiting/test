import ArkTemplate from '../../arkTemplate';

class EM1M2 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    let tpl = `<Texture size="${this.width},${this.height}"`;
    if (this.path) {
      tpl += `value="${this.path}"`;
    }
    if (this.bgColor) {
      tpl += `color="${this.bgColor}"></Texture>`;
    }
    this._template = tpl;
  }
}

export default EM1M2;
