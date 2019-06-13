const HtmlTemplate = require('../../htmlTemplate');
class EM2M2 extends HtmlTemplate {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="shape" $ref="1" @constraints>
      <span $ref="0" class="text"></span>
    </div>`
  }
  constraints(node) {
    node.constraints = {
      "LayoutDirection": "Horizontal",
      "LayoutJustifyContent": "Start"
    }
  }
}
module.exports = EM2M2;