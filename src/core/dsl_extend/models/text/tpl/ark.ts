import ArkTemplate from '../../../../dsl_service_ts/template/ark/arkTemplate';
import Resource from '../../../../dsl_service_ts/render/ark/resource';
export default class Text extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    let tpl = `<Text value="${this.text}" size margin anchors multiline align`;
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
