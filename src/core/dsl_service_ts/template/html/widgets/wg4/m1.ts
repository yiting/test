import HtmlTemplate from '../../htmlTemplate';

class WG4M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="image3Txt" :constraints='{"LayoutDirection":"Horizontal"}'>
      <img $ref="3" class="img" :constraints='{"LayoutSelfHorizontal":"Left","LayoutFixedWidth":"Fixed","LayoutFixedHeight":"Fixed"}' :src="this.requireImgPath(path)"/>
      <dl class="content" :constraints='{"LayoutFlex":"Auto","LayoutJustifyContent":"Start"}'>
        <dd $ref="0" class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd $ref="1" class="subtext" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd $ref="2" class="ltext" :constraints='{"LayoutFlex":"Auto"}'></dd>
      </dl>
    </div>`;
  }
}
export default WG4M1;
