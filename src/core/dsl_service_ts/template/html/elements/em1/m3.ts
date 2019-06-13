import HtmlTemplate from '../../htmlTemplate';

class EM1M3 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<img class="img" :src="this.requireImgPath(path)"></img>';
  }
}

export default EM1M3;
