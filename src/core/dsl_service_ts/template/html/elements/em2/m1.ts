import HtmlTemplate from '../../htmlTemplate';

class EM2M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);

    this._template = `
    <div class="tag" $ref="1">
      <span $ref="0" class="text"></span>
    </div>`;
    /* this._template = `
    <div class="tag" $ref="1" @constraints>
      <span $ref="0" class="text"></span>
    </div>`;
 */
    /* this._methods = {
      constraints(_node: any) {
        const node: any = _node;
        Object.assign(node.constraints, {
          LayoutDirection: 'Horizontal',
          LayoutJustifyContent: 'Center',
        });
      },
    }; */
  }
}
export default EM2M1;
