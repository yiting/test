const Template = require('../template');
const XML_Engine = require('../XML_Engine');
const Path = require('path');
const Config = require('../../render/config');

module.exports = class htmlTemplate extends Template {
    constructor() {
        super(...arguments);
        this._engine = XML_Engine;
    }
    requireImgPath(path) {
        return Path.join(Path.relative(Config.HTML.output.htmlPath, Config.HTML.output.imgPath), path)
    }
}