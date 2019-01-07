// (3节点基础元素)左文字 + 右固定长度标签 
//
// (QText)-(QIcon+QText)
// 
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');
const Utils = require('../../dsl_utils.js');

class EM3M4 extends Model.ElementModel {
    constructor() {
        // 元素构成规则
        super('em3-m4', 2, 1, 0, 0, Common.LvS, Common.QText);
    }

    // 区分三个基础元素的逻辑
    _initNode() {
        let texts = this.getTextNodes();
        let icons = this.getIconNodes();
        Utils.sortListByParam(texts, 'abX');

        this._matchNodes['1'] = icons[0];           // tag的icon背景
        this._matchNodes['2'] = texts[1];           // tag的文字
        this._matchNodes['0'] = texts[0];           // 主文字
    }

    // 元素方向
    regular1() {
        let bool = Feature.directionArightToB(this._matchNodes['2'], this._matchNodes['0'])
                    && Feature.directionArightToB(this._matchNodes['1'], this._matchNodes['0']);
        
        return bool;
    }

    // 水平轴方向
    regular2() {
        // 三者都处于水平轴方向上
        let bool = Feature.baselineABInHorizontal(this._matchNodes['1'], this._matchNodes['0'])
                    && Feature.baselineABInHorizontal(this._matchNodes['1'], this._matchNodes['2'])
                    && Feature.baselineABInHorizontal(this._matchNodes['0'], this._matchNodes['2']);

        return bool;
    }

    // 元素距离
    regular3() {
        // tagShape与mainTxt的距离必须小于24,大于0
        let bool = Feature.distanceGreatAleftToBright(this._matchNodes['1'], this._matchNodes['0'], 0)
                    && Feature.distanceLessAleftToBright(this._matchNodes['1'], this._matchNodes['0'], 24);

        return bool;
    }

    // 位置关系
    regular4() {
        // tagTxt在tagShape的里面并且居中
        let bool = Feature.positionAInBCenter(this._matchNodes['2'], this._matchNodes['1']);

        return bool;
    }

    // 尺寸关系
    regular5() {
        // 1. tagShape一般占mainTxt字高度的大于1/2, 小于1.1
        // 2. tagShape的宽度一般超tagTxt字宽度小于1.2
        let bool = Feature.sizeHeightRatioAGreatB(this._matchNodes['1'], this._matchNodes['0'], 0.5)
                    && Feature.sizeHeightRatioALessB(this._matchNodes['1'], this._matchNodes['0'], 1.1)
                    && Feature.sizeWidthRatioAGreatB(this._matchNodes['2'], this._matchNodes['1'], 0.5);
        
        return bool;
    }
}

module.exports = EM3M4;
