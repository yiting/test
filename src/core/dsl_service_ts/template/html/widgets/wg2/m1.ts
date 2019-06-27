import HtmlTemplate from '../../htmlTemplate';

export default class WG2M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="iconTxt" :constraints='{"LayoutDirection":"Vertical"}'>
        <span $ref="1" class="icon"></span>
        <p $ref="0" class="text"></p>
      </div>`;
  }
}
