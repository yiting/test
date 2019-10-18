import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';

class List extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<ul class="list"></ul>';
  }
}

export default List;
