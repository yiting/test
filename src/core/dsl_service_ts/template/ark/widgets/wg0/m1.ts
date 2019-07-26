import ArkTemplate from '../../arkTemplate';
import ImgTpl from '../../elements/em1/m2';
class LAYER extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    let tpl = `<View  size="${this.width},${this.height}"  margin anchors>`;
    // tpl += `<Layout type="ListLayout" orientation />`
    if (this.path) {
      tpl += `<Image  size="${this.width},${this.height}" value="${
        this.path
      }" margin anchors @constraints='{
          "LayoutSelfPosition":"Absolute"
        }' />`;
    } else {
      this._template = `<Texture color="${
        this.bgColor
      }"  margin anchors  @constraints='{
        "LayoutSelfPosition":"Absolute"
      }/>`;
    }
    tpl += `</View>`;

    this._template = tpl;
  }
}

export default LAYER;
