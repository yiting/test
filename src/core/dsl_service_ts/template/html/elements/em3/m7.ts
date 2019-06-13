import HtmlTemplate from '../../htmlTemplate';

class EM3M7 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="em3-m7" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span $ref="0" class="tag">
        <em $ref="1" class="tag-text"></em>
      </span>
      <span $ref="2" class="text"></span>
    </div>`;
  }
}
export default EM3M7;
