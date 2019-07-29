import HtmlTemplate from '../../htmlTemplate';

class WG4M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="image3Txt" @constraints='{"LayoutDirection":"Horizontal"}'>
      <img $ref="3" class="img" @constraints='{"LayoutSelfHorizontal":"Left","LayoutFixedWidth":"Fixed","LayoutFixedHeight":"Fixed"}' :src="this.requireImgPath(path)"/>
      <dl class="content" @constraints='{"LayoutFlex":"Auto","LayoutJustifyContent":"Start"}'>
        <dd class="text" @constraints='{"LayoutFlex":"Auto"}'>
          <span $ref="0"></span>
        </dd>
        <dd class="subtext" @constraints='{"LayoutFlex":"Auto"}'>
          <span $ref="1"></span>
        </dd>
        <dd class="ltext" @constraints='{"LayoutFlex":"Auto"}'>
          <span $ref="2"></span>
        </dd>
      </dl>
    </div>`;
  }
}
export default WG4M1;
