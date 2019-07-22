import HtmlTemplate from '../../htmlTemplate';
import Constraints from '../../../../helper/constraints';
class EM2M2 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);

    this._template = `
    <div class="tagShape" $ref="1" @constraints>
      <span $ref="0" class="text"></span>
    </div>`;

    this._methods = {
      constraints(_node: any) {
        const node: any = _node;
        Object.assign(node.constraints, {
          LayoutDirection: Constraints.LayoutDirection.Horizontal,
          LayoutJustifyContent: Constraints.LayoutJustifyContent.Center,
          LayoutFixedHeight: Constraints.LayoutFixedHeight.Fixed,
        });
      },
    };
  }
}
export default EM2M2;
