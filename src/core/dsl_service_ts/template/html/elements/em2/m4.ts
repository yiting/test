import HtmlTemplate from '../../htmlTemplate';

class EM2M4 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div>
        <span $ref="0" class="text"></span>
        <i $ref="1" class="icon"></i>
      </div>`;
  }
}
export default EM2M4;
