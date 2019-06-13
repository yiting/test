// (3节点基础元素)左固定长度标签 + 右文字
//
// (QIcon+QText)-(QText)
// 
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');
const Utils = require('../../dsl_utils.js');

class EM3M3 extends Model.ElementModel {
    constructor() {
        // 元素构成规则
        super('em3-m3', 2, 1, 0, 0, Common.LvS, Common.QText);

        this.canLeftFlex = false;
        this.canRightFlex = true;
    }

    // 区分三个基础元素的逻辑
    _initNode() {
        let texts = this.getTextNodes();
        let icons = this.getIconNodes();
        Utils.sortListByParam(texts, 'abX');

        this._matchNodes['0'] = icons[0];           // tag的icon背景
        this._matchNodes['1'] = texts[0];           // tag的文字
        this._matchNodes['2'] = texts[1];           // 主文字
    }

    // 元素方向
    regular1() {
        let bool = Feature.directionAleftToB(this._matchNodes['1'], this._matchNodes['2'])
                    && Feature.directionAleftToB(this._matchNodes['0'], this._matchNodes['2']);

        return bool;
    }

    // 水平轴方向
    regular2() {
        // 三者都处于水平轴方向上
        let group = [this._matchNodes['0'], this._matchNodes['1'], this._matchNodes['2']];
        let bool = Feature.baselineGroupAInHorizontal(group);

        return bool;
    }

    // 元素距离
    regular3() {
        // tagShape与mainTxt的距离必须小于24,大于0
        let bool = Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['2'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['2'], 24);

        return bool;
    }

    // 位置关系
    regular4() {
        let bool = Feature.positionAInBCenter(this._matchNodes['1'], this._matchNodes['0']);

        return bool;
    }

    // 尺寸关系
    regular5() {
        // 1. tagShape一般占mainTxt字高度的大于1/2, 小于1.1
        // 2. 文字长度应超过标签长度的一半
        let bool = Feature.sizeHeightRatioAGreatB(this._matchNodes['0'], this._matchNodes['2'], 0.5)
                    && Feature.sizeHeightRatioALessB(this._matchNodes['0'], this._matchNodes['2'], 1.1)
                    && Feature.sizeWidthRatioAGreatB(this._matchNodes['1'], this._matchNodes['0'], 0.5);

        return bool;
    }
}

module.exports = EM3M3;
