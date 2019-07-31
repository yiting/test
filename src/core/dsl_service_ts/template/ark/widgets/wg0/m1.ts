import ArkTemplate from '../../arkTemplate';
class LAYER extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    let tpl = `<View size margin anchors`;
    if (this._renderData.type == 'QBody') {
      tpl += `metadatatype="shareData">
          <Event>
          <OnSetValue value="app.OnSetMetaData"/>
          <OnResize value="app.OnResize"/>
      </Event>`;
    } else {
      tpl += '>';
    }
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
