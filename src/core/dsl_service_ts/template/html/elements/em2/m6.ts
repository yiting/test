import HtmlTemplate from '../../htmlTemplate';

class EM2M6 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
        <span class="link">
            <span $ref="0" class="linktext"></span>
            <i class="linkshape"  $ref="1"></i>
        </span>
      `;
  }
}
export default EM2M6;
