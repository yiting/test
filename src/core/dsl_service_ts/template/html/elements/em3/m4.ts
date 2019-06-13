import HtmlTemplate from '../../htmlTemplate';

class EM3M4 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="em3-m4" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
      <span $ref="0" class="text"></span>
      <span $ref="1" class="tag">
        <em $ref="2" class="tag-text"></em>
      </span>
    </div>`;
  }
}
export default EM3M4;
