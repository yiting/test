import HtmlTemplate from '../../htmlTemplate';

class EM2M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
    <div class="tagIcon" $ref="1" @constraints>
      <span $ref="0" class="text"></span>
    </div>`;

    this._methods = {
      constraints(_node: any) {
        const node: any = _node;
        node.constraints = {
          LayoutDirection: 'Horizontal',
          LayoutJustifyContent: 'Center',
        };
      },
    };
  }
}

export default EM2M1;
