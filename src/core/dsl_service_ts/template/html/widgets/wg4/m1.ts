import HtmlTemplate from '../../htmlTemplate';

class WG4M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="imgInfo" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <img $ref="0" class="img" :constraints='{"LayoutSelfHorizontal":"Left","LayoutFixedWidth":"Fixed","LayoutFixedHeight":"Fixed"}' :src="this.requireImgPath(path)"/>
      <dl class="content" :constraints='{"LayoutFlex":"Auto","LayoutJustifyContent":"Start"}'>
        <dd $ref="1" class="primary" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd $ref="2" class="info" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd $ref="3" class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
      </dl>
    </div>`;
  }
}
export default WG4M1;
