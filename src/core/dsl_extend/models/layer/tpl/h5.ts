import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';

export default class Layer extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<div :class="layerClassName()"></div>';
  }
}
