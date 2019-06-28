import HtmlTemplate from '../../htmlTemplate';

class WG3M3 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="imageDesc">
          <img $ref="2" class="img" :src="this.requireImgPath(path)"/>
          <p $ref="0" class="text"></p>
          <p $ref="1" class="subtext"></p>
      </div>`;
  }
}
export default WG3M3;
