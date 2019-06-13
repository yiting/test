import HtmlTemplate from '../../htmlTemplate';

export default class WG2M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="label" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span $ref="0" class="icon"></span>
      <p $ref="1" class="text"></p>
    </div>`;
  }
}
