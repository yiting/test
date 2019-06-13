import HtmlTemplate from '../../htmlTemplate';

export default class WG2M3 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="icon-desc">
        <span $ref="0" class="icon"></span>
        <p $ref="1" class="text"></p>
    </div>`;
  }
}
