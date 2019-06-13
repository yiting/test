import HtmlTemplate from '../../htmlTemplate';

class WG4M2 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="imgDesc">
      <ul class="content" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
        <li $ref="0" class="img" :constraints='{"LayoutFlex":"Auto"}'></li>
        <li $ref="1" class="img" :constraints='{"LayoutFlex":"Auto"}'></li>
        <li $ref="2" class="img" :constraints='{"LayoutFlex":"Auto"}'></li>
      </ul>
      <p $ref="3" class="text"></p>
    </div>`;
  }
}
export default WG4M2;
