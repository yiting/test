// (1节点基础元素)图标Icon
//
// 此模型为纯Icon组件模型, 只包含一个QIcon
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM1M2 extends Model.ElementModel {
    constructor() {
        super('em1-m2', 0, 1, 0, 0, Common.LvD, Common.QIcon);

        this.canLeftFlex = false;
        this.canRightFlex = false;
    }

    _initNode() {
        this._matchNodes['0'] = this.getIconNodes()[0];
    }

    // 节点必须是QIcon节点
    regular1() {
        let nodes = this.getNodes();
        return Feature.propertyNodeAreQIcon(nodes);
    }
}

module.exports = EM1M2;
