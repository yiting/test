const Common = require('../../../../dsl2/dsl_common');
const HtmlTemplate = require('../../htmlTemplate');
class LAYER extends HtmlTemplate {
    constructor() {
        super(...arguments);
    }
    get template() {
        return `<div :class="className()"></div>`
    }
    className(node) {
        let indexObj = {
            level: 0,
            layerLevel: 0
        }
        LAYER.getLayerLevel(node, indexObj)
        if (indexObj.level == 0) {
            return 'main';
        } else if (indexObj.level == 1) {
            return 'section'
        } else if (indexObj.layerLevel == 0) {
            return 'box';
        }
        return 'block';
    }
    static getLayerLevel(node, indexObj) {
        if (!node.parent) {
            return;
        }
        if (node.parent.type == Common.QLayer) {
            indexObj.layerLevel++;
        }
        indexObj.level++;
        return LAYER.getLayerLevel(node.parent, indexObj)

    }
}

module.exports = LAYER;