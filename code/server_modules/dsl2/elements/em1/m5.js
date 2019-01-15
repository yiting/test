// (1节点基础元素)文字Text
//
// 此模型为纯文字组件模型, 只包含一个QText
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM1M5 extends Model.ElementModel {
    constructor() {
        super('em1-m5', 1, 0, 0, 0, Common.LvD, Common.QText);

        this.canLeftFlex = false;
        this.canRightFlex = true;
    }

    _initNode() {
        this._matchNodes['0'] = this.getTextNodes()[0];
    }

    // 节点必须是QText节点
    regular1() {
        let nodes = this.getNodes();
        return Feature.propertyNodeAreQText(nodes);
    }

    // 节点必须是QText节点
    regular2() {
        let text = this._matchNodes['0']
        return Feature.fontSizeLimit(text, 30, 200);
    }
}

module.exports = EM1M5;