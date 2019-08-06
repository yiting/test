import ArkTemplate from '../../arkTemplate';
class LAYER extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    let tpl = `<View size margin anchors>`;
    if (this.path) {
      tpl += `<Image size value="${
        this.path
      }" margin anchors @constraints='{"LayoutSelfPosition":"Absolute"}' />`;
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
