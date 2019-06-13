import HtmlTemplate from '../../htmlTemplate';

class WG2M4 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="img-desc" :constraints='{"LayoutJustifyContent":"Start"}'>
        <i $ref="0" class="img"></i>
        <div class="text">
          <span $ref="1"></span>
        </div>
    </div>`;
  }
}
export default WG2M4;
