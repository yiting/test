import HtmlTemplate from '../../htmlTemplate';

class EM3M1 extends HtmlTemplate {
  constraints: () => { LayoutDirection: string; LayoutJustifyContent: string };

  constructor(...args: any[]) {
    super(args);
    this._template = `
    <div class="em3-m1" :constraints="this.constraints">
      <span $ref="0" class="tag">
        <em $ref="1" class="tagText"></em>
      </span>
      <span $ref="2" :class="textClassName()"></span>
    </div>`;

    this.constraints = function() {
      return {
        LayoutDirection: 'Horizontal',
        LayoutJustifyContent: 'Start',
      };
    };
  }
}

export default EM3M1;
