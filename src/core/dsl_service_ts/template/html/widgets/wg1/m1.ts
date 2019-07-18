import HtmlTemplate from '../../htmlTemplate';

export default class WG1M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<div class="hr" :constraints='{"LayoutFixedHeight":"Fixed"}' $ref="0"></div>`;
  }
}
