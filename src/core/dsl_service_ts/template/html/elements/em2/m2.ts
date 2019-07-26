import HtmlTemplate from '../../htmlTemplate';
import Constraints from '../../../../helper/constraints';
class EM2M2 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);

    this._template = `
    <div class="tagShape" $ref="1" @constraints="{
        LayoutDirection: Constraints.LayoutDirection.Horizontal,
        LayoutJustifyContent: Constraints.LayoutJustifyContent.Center,
        LayoutFixedHeight: Constraints.LayoutFixedHeight.Fixed,
      }">
      <span $ref="0" class="text"></span>
    </div>`;
  }
}
export default EM2M2;
