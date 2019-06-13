import HtmlTemplate from '../../htmlTemplate';

class EM3M2 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="block" :constraints='{"LayoutDirection": "Horizontal","LayoutJustifyContent": "Start"}'>
      <span $ref="2" :class="textClassName()"></span>
      <em $ref="0" class="tag">
        <span $ref="1" class="tagText"></span>
      </em>
    </div>`;
  }
}
export default EM3M2;
