// (2节点基础元素)以Shape为底,Text在里面的类似tag结构
//
// (QShape)-(QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM2M2 extends Model.ElementModel {
    constructor() {
        // 元素构成规则
        super('em2-m2', 1, 0, 0, 1, Common.LvA, Common.QText);

        this.canLeftFlex = false;
        this.canRightFlex = false;
    }

    _initNode() {
        let texts = this.getTextNodes();
        let shapes = this.getShapeNodes();
        
        this._matchNodes['0'] = texts[0];
        this._matchNodes['1'] = shapes[0];
    }

    // 元素方向
    regular1() {
        return true;
    }

    // 水平轴方向
    regular2() {
        return true;
    }

    // 元素距离
    regular3() {
        return true;
    }

    // 位置关系
    regular4() {
        let bool = Feature.positionAInBCenter(this._matchNodes['0'], this._matchNodes['1']);
        
        return bool;
    }

    // 尺寸关系
    regular5() {
        // 1. 文字高度占图形超1/2
        // 2. 文字长度占图形超1/2
        let bool = Feature.sizeHeightRatioAGreatB(this._matchNodes['0'], this._matchNodes['1'], 0.5)
                    && Feature.sizeWidthRatioAGreatB(this._matchNodes['0'], this._matchNodes['1'], 0.5);

        return bool;
    }
}

module.exports = EM2M2;
