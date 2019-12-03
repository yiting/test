import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';

export default class ListItem extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<li class="listitem"></li>';
  }
}
