import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';

class Inline extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<span class="inline"></span>';
  }
}

export default Inline;
