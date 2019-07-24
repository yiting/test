import HtmlTemplate from '../../htmlTemplate';

class CYCLE01 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<ul>
          <li $each class="item">
          </li>
      </ul>`;
  }
}
export default CYCLE01;
