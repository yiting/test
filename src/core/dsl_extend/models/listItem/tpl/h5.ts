import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';

class ListItem extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<li class="listitem"></li>';
  }
}

export default ListItem;
