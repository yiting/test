import HtmlTemplate from '../../htmlTemplate';

class EM2M5 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="shape" $ref="0">
        <span $ref="1" class="shape-text"></span>
      </div>`;
  }
}
export default EM2M5;
