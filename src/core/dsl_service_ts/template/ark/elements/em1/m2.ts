import ArkTemplate from '../../arkTemplate';

class EM1M2 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<Texture size="${this.width},${this.height}" value="${
      this.path
    }"></Texture>`;
  }
}

export default EM1M2;
