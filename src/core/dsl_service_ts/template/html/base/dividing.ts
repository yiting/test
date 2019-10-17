import HtmlTemplate from '../htmlTemplate';

export default class Dividing extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<div class="hr" @constraints='{
          "LayoutFixedHeight":"Fixed",
          "LayoutFixedWidth":"Fixed"
      }' $ref="0"></div>`;
  }
}
