const HtmlTemplate = require('../../htmlTemplate');
class EM2M5 extends HtmlTemplate {
    constructor() {
        super(...arguments);
    }
    get template() {
        return `
      <div class="shape"  $ref="0">
        <span $ref="1" class="shape-text"></span>
      </div>`
    }
}
module.exports = EM2M5;