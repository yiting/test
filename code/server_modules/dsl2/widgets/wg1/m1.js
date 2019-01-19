// (1节点元素)水平分割线
//
// (QShape)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class WG1M1 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg1-m1', 0, 0, 0, 1, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = false;
    }

    _initNode() {
        this._matchNodes['0'] = this.getShapeNodes()[0];
    }

    // 元素方向
    regular1() {
        return Feature.sizeHeightLess(this._matchNodes['0'], Common.DesignWidth * 0.054) &&
            Feature.sizeWidthGreat(this._matchNodes['0'], Common.DesignWidth * .8);
    }
}

module.exports = WG1M1;