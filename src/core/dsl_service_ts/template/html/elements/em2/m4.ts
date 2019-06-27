import HtmlTemplate from '../../htmlTemplate';

class EM2M4 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="btnShape" $ref="1">
        <span $ref="0" class="text"></span>
      </div>`;
  }
}

export default EM2M4;
