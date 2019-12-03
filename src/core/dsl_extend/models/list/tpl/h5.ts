import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';

export default class List extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<ul class="list"></ul>';
  }
}
