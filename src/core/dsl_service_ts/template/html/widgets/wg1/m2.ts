import HtmlTemplate from '../../htmlTemplate';

export default class WG1M2 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<div class="hr-image" :constraints='{"LayoutFixedHeight":"Fixed"}' $ref="0"></div>`;
  }
}
