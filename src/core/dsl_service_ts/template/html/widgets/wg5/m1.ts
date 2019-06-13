import HtmlTemplate from '../../htmlTemplate';

class WG5M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
      <div class="imgDesc" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
        <ul class="content" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
            <li $ref="0" class="img" :constraints='{"LayoutFlex":"Auto"}'></li>
            <li $ref="1" class="img" :constraints='{"LayoutFlex":"Auto"}'></li>
            <li $ref="2" class="img" :constraints='{"LayoutFlex":"Auto"}'></li>
        </ul>
        <dl class="content" :constraints='{"LayoutFlex":"Auto","LayoutJustifyContent":"Start"}'>
          <dd $ref="3" class="primary" :constraints='{"LayoutFlex":"Auto"}'></dd>
          <dd $ref="4" class="sub" :constraints='{"LayoutFlex":"Auto"}'></dd>
        </dl>
      </div>`;
  }
}

export default WG5M1;
