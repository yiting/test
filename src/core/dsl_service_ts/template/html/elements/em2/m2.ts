import HtmlTemplate from '../../htmlTemplate';

class EM2M2 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);

    this._template = `
    <div class="shape" $ref="1" @constraints>
      <span $ref="0" class="text"></span>
    </div>`;

    this._methods = {
      constraints(_node: any) {
        const node: any = _node;
        Object.assign(node.constraints, {
          LayoutDirection: 'Horizontal',
          LayoutJustifyContent: 'Start',
        });
      },
    };
  }
}
export default EM2M2;