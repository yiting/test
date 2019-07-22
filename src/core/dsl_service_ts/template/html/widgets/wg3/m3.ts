import HtmlTemplate from '../../htmlTemplate';

class WG3M3 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="imageDesc">
          <img $ref="2" class="img" :src="this.requireImgPath(path)"/>
          <p class="text"><span $ref="0"></span></p>
          <p class="subtext"><span $ref="1"></span></p>
      </div>`;
  }
}
export default WG3M3;
