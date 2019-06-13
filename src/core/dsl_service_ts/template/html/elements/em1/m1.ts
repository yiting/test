import HtmlTemplate from '../../htmlTemplate';

class EM1M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<span :class="textClassName()"></span>';
  }
}

export default EM1M1;
