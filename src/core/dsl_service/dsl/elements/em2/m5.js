// (2节点基础元素)QShape下 - QText 上
//
// (QText)-(QShape)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM2M5 extends Model.ElementModel {
    constructor() {
        // 元素构成规则
        super('em2-m5', 1, 0, 0, 1, Common.LvA, Common.QText);

        this.canLeftFlex = false;
        this.canRightFlex = false;
    }

    _initNode() {
        let shapes = this.getShapeNodes();
        let texts = this.getTextNodes();

        this._matchNodes['0'] = shapes[0];          // shape
        this._matchNodes['1'] = texts[0];           // text
    }

    // 位置关系
    regular1() {
        let bool = Feature.positionAInBCenter(this._matchNodes['1'], this._matchNodes['0']);

        return bool;
    }

    // 尺寸关系
    regular2() {
        let bool = Feature.sizeHeightRatioALessB(this._matchNodes['0'], this._matchNodes['1'], 2.4) &&
            Feature.sizeHeightRatioAGreatB(this._matchNodes['0'], this._matchNodes['1'], 1);

        return bool;
    }
}

module.exports = EM2M5;