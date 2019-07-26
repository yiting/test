import ArkTemplate from '../../arkTemplate';

class EM1M2 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    if (this.path) {
      this._template = `<Image size="${this.width},${this.height}" value="${
        this.path
      }"  margin anchors/>`;
    } else {
      this._template = `<Texture size="${this.width},${this.height}" color="${
        this.bgColor
      }"  margin anchors/>`;
    }
  }
}
export default EM1M2;
