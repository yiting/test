// (2节点基础元素)左标签右文字
//
// (QIcon)-(QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM2M1 extends Model.ElementModel {
    constructor() {
        // 元素构成规则
        super('em2-m1', 1, 1, 0, 0, Common.LvA, Common.QText);

        this.canLeftFlex = false;
        this.canRightFlex = true;
    }

    _initNode() {
        let texts = this.getTextNodes();
        let icons = this.getIconNodes();
        
        this._matchNodes['0'] = texts[0];
        this._matchNodes['1'] = icons[0];
    }

    // 元素方向
    regular1() {
        // icon位于文字左侧
        return Feature.directionAleftToB(this._matchNodes['0'], this._matchNodes['1']);
    }

    // 水平轴方向
    regular2() {
        // icon和txt在主轴上属于水平轴 
        return Feature.baselineABInHorizontal(this._matchNodes['0'], this._matchNodes['1']);
    }

    // 元素距离
    regular3() {
        // icon与txt的距离必须大于0,小于22
        return Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['1'], -4)
                && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 24);
    }

    // 尺寸关系
    regular4() {
        // 1. 图标一般占mainTxt字高度的大于1/2, 小于1.05(1)
        return Feature.sizeHeightRatioAGreatB(this._matchNodes['0'], this._matchNodes['1'], 0.5)
                && Feature.sizeHeightRatioALessB(this._matchNodes['0'], this._matchNodes['1'], 1.1);
    }
}

module.exports = EM2M1;
