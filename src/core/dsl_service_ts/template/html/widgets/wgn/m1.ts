import HtmlTemplate from '../../htmlTemplate';

class CYCLE01 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<ul class="list">
          <li $each class="item">
          </li>
      </ul>`;
  }
}
export default CYCLE01;
