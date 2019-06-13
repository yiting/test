import HtmlTemplate from '../../htmlTemplate';

class EM3M9 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="content" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
       <span $ref="0" class="text"></span>
       <span $ref="1" class="vLine"></span>
       <span $ref="2" class="text"></span>
    </div>`;
  }
}
export default EM3M9;
