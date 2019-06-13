// (1节点基础元素)绘图Shape
//
// 此模型为纯Shape组件模型, 只包含一个QShape
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM1M4 extends Model.ElementModel {
    constructor() {
        super('em1-m4', 0, 0, 0, 1, Common.LvD, Common.QShape);

        this.canLeftFlex = false;
        this.canRightFlex = false;
    }

    _initNode() {
        this._matchNodes['0'] = this.getShapeNodes()[0];
    }

    // 节点必须是QShape节点
    regular1() {
        let nodes = this.getNodes();
        return Feature.propertyNodeAreQShape(nodes);
    }
}

module.exports = EM1M4;
