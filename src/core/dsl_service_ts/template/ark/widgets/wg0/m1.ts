import ArkTemplate from '../../arkTemplate';
class LAYER extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    let tpl = `<View size margin anchors radius>`;
    if (this.path) {
      tpl += `<Image size value="${this.path}" margin anchors radius/>`;
    } else if (this.bgColor) {
      tpl += `<Texture color="${this.bgColor}"  margin anchors radius/>`;
    }
    tpl += `</View>`;

    this._template = tpl;
  }
}

export default LAYER;
