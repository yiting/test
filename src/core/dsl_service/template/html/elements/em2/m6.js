const HtmlTemplate = require('../../htmlTemplate');
class EM2M6 extends HtmlTemplate {
    constructor() {
        super(...arguments);
    }
    get template() {
        return `
        <span class="link">
            <span $ref="0" class="linktext"></span>
            <i class="linkshape"  $ref="1"></i>
        </span>
      `
    }
}
module.exports = EM2M6;