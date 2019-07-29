import HtmlTemplate from '../../htmlTemplate';

class WG3M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="imageInfo" @constraints='{"LayoutDirection":"Horizontal"}'>
        <span $ref="2" class="icon" :style="'background-image:url('+this.requireImgPath(path)+')'"></span>
        <dl>
          <dd class="text">
            <span $ref="0"></span>
          </dd>
          <dd class="subtext">
            <span $ref="1"></span>
          </dd>
        </dl>
      </div>`;
  }
}
export default WG3M1;
