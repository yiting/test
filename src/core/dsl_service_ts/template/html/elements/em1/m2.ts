import HtmlTemplate from '../../htmlTemplate';

class EM1M2 extends HtmlTemplate {
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

export default EM1M2;
