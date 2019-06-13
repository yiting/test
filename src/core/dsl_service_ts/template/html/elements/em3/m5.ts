import HtmlTemplate from '../../htmlTemplate';

class EM3M5 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="label" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span $ref="0" class="tag">
        <em $ref="1" class="tag-text"></em>
      </span>
      <span $ref="2" class="text"></span>
    </div>`;
  }
}
export default EM3M5;
