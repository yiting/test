import HtmlTemplate from '../../htmlTemplate';

class EM2M7 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="image" $ref="0">
        <span $ref="1" class="image-text"></span>
      </div>`;
  }
}
export default EM2M7;
