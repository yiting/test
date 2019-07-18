import ArkTemplate from '../../arkTemplate';

class CYCLE01 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<ul class="list">
          <li $each class="item">
          </li>
      </ul>`;
  }
}
export default CYCLE01;
