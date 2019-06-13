import HtmlTemplate from '../../htmlTemplate';

export default class WG2M2 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="information" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span $ref="0" class="text"></span>
      <i $ref="1" class="icon"></i>
    </div>`;
  }
}
