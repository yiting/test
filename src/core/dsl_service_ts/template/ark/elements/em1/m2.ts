import ArkTemplate from '../../arkTemplate';

class EM1M2 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    if (this.path) {
      this._template = `<Image size value="${
        this.path
      }"  margin anchors radius/>`;
    } else {
      console.log(this._renderData.id);
      this._template = `<Texture size color="${
        this.bgColor
      }"  margin anchors/>`;
    }
  }
}
export default EM1M2;
