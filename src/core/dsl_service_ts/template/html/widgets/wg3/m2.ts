import HtmlTemplate from '../../htmlTemplate';

class WG3M2 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="imgInfo" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
      <i $ref="0" class="icon" :style="'background-image:url('+this.requireImgPath(path)+')'"></i>
      <dl>
        <dd class="text">
          <span $ref="1"></span>
        </dd>
        <dd class="subtext">
          <span $ref="2"></span>
        </dd>
      </dl>
    </div>`;
  }
}
export default WG3M2;
