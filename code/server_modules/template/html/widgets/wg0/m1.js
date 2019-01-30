const HtmlTemplate = require('../../htmlTemplate');
class LAYER extends HtmlTemplate {
    constructor() {
        super(...arguments);
    }
    get template() {
        return `<div :class="layerClassName()"></div>`
    }
}

module.exports = LAYER;