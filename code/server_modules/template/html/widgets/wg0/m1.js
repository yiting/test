const Template = require('../../../template');
class LAYER extends Template {
    constructor() {
        super(...arguments);
    }
    get template() {
        return `<div :class="className()"></div>`
    }
    className(node) {
        return 'layer';
    }
}

module.exports = LAYER;