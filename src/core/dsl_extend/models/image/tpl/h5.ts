import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';

export default class Image extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    if (this._renderData.children.length) {
      this._template = '<div class="img"></div>';
    } else {
      this._template = '<img class="img" :src="this.requireImgPath(path)"/>';
    }
  }
}
