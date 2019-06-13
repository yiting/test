import HtmlTemplate from '../../htmlTemplate';

class WG2M7 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div $ref="0" class="wg2-m7">
        <span $ref="1" class="text"></span>
    </div>`;
  }
}

export default WG2M7;
