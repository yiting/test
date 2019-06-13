import HtmlTemplate from '../../htmlTemplate';

class WG3M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="iconInfo" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
        <span $ref="0" class="icon"></span>
        <dl>
          <dd $ref="1" class="primary"></dd>
          <dd $ref="2" class="sub"></dd>
        </dl>
      </div>`;
  }
}
export default WG3M1;
