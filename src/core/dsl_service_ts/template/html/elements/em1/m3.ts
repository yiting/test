import HtmlTemplate from '../../htmlTemplate';

class EM1M3 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    const path = this._renderData.path
      ? this.requireImgPath(this._renderData.path)
      : '';
    this._template = `<i class="icon" ${
      path ? `style="background-image:url(${path})"` : ''
    }></i>`;
  }
}

export default EM1M3;
