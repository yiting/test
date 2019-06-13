// (1节点基础元素)图片Image
//
// 此模型为纯Image组件模型, 只包含一个QImage
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM1M3 extends Model.ElementModel {
    constructor() {
        super('em1-m3', 0, 0, 1, 0, Common.LvD, Common.QImage);

        this.canLeftFlex = false;
        this.canRightFlex = false;
    }

    _initNode() {
        this._matchNodes['0'] = this.getImageNodes()[0];
    }

    // 节点必须是QImage节点
    regular1() {
        let nodes = this.getNodes();
        return Feature.propertyNodeAreQImage(nodes);
    }
}

module.exports = EM1M3;
