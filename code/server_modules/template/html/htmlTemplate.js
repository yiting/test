const Template = require('../template');
const XML_Engine = require('../XML_Engine');
const Path = require('path');
const Config = require('../../render/config');
const Common = require('../../dsl2/dsl_common');

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
        return HtmlTemplate.getLayerLevel(node.parent, indexObj)
    }

}