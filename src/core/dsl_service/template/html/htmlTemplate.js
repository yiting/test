const Template = require('../template');
const XML_Engine = require('../XML_Engine');
const Path = require('path');
const Config = require('../../render/config');
const Common = require('../../dsl/dsl_common');

module.exports = class HtmlTemplate extends Template {
    constructor() {
        super(...arguments);
        this._engine = XML_Engine;
    }
    requireImgPath(path) {
        return Path.join(Path.relative(Config.HTML.output.htmlPath, Config.HTML.output.imgPath), path)
    }
    textClassName(node) {
        if (node.styles.texts[0].size > 30) {
            return 'title'
        }
        return 'text'
    }
    layerClassName(node) {
        let indexObj = {
            level: 0,
            layerLevel: 0
        }
        HtmlTemplate.getLayerLevel(node, indexObj)
        if (indexObj.level == 0) {
            return 'main';
        } else if (indexObj.level == 1) {
            return 'section';
        } else if (indexObj.level == 2) {
            return 'panel';
        } else if (indexObj.layerLevel == 3) {
            return 'wrap'
        } else if (indexObj.layerLevel == 4) {
            return 'box'
        } else if (indexObj.layerLevel == 5) {
            return 'inner'
        }
        return 'block';
    }
    static getLayerLevel(node, indexObj) {
        if (!node.parent) {
            return;
        }
        if (node.parent.modelName == 'layer') {
            indexObj.layerLevel++;
        }
        indexObj.level++;
        return HtmlTemplate.getLayerLevel(node.parent, indexObj)
    }

}