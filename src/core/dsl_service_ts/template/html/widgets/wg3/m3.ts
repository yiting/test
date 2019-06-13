import HtmlTemplate from '../../htmlTemplate';

class WG3M3 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="imgDesc">
          <img $ref="0" class="img" :src="this.requireImgPath(path)"/>
          <p $ref="1" class="text"></p>
          <p $ref="2" class="subtext"></p>
      </div>`;
  }
}
export default WG3M3;
