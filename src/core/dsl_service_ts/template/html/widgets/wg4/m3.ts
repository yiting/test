import HtmlTemplate from '../../htmlTemplate';

class WG4M3 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
  <div class="imgInfo" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
    <ul class="imglist" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
        <li $ref="0" class="img"></li>
        <li $ref="1" class="img"></li>
        <li $ref="2" class="img"></li>
    </ul>
    <p $ref="3" class="text"></p>
  </div>`;
  }
}

export default WG4M3;
