import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';

export default class Body extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<div class="section"></div>';
  }
}
