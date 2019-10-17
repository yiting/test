import HtmlTemplate from '../htmltemplate';

class Image extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    if (this._renderData.path) {
      this._template =
        '<img class="img" :src="this.requireImgPath(path)"></img>';
    } else {
      this._template = '<div class="img"></div>';
    }
  }
}

export default Image;
