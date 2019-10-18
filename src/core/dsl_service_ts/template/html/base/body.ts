import HtmlTemplate from '../htmltemplate';

class Body extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<div class="main"></div>';
  }
}

export default Body;
