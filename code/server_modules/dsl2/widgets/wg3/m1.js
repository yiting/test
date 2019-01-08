// (3节点元素)左Icon右两文字
//
// (QIcon) + (QText) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');
const Utils = require('../../dsl_utils.js');

class WG3M1 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg3-m1', 2, 1, 0, 0, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = true;
    }

    _initNode() {
        let texts = this.getTextNodes();
        let icons = this.getIconNodes();
        Utils.sortListByParam(texts, 'abY');

        this._matchNodes['0'] = icons[0];
        this._matchNodes['1'] = texts[0];
        this._matchNodes['2'] = texts[1];
    }

    // 元素方向
    regular1() {
        // icon位于两文字左侧
        let bool = Feature.directionAleftToB(this._matchNodes['0'], this._matchNodes['1'])
                    && Feature.directionAleftToB(this._matchNodes['0'], this._matchNodes['2']);
        
        return bool;
    }

    // 水平轴方向
    regular2() {
        // icon与两文字位于水平轴
        let bool = Feature.baselineABInHorizontal(this._matchNodes['0'], this._matchNodes['1'])
                    && Feature.baselineABInHorizontal(this._matchNodes['0'], this._matchNodes['2']);

        return bool;
    }

    regular3() {
        // 两个文字位于垂直轴
        let bool = Feature.baselineGroupAInVertical([this._matchNodes['1'], this._matchNodes['2']]);

        return bool;
    }

    // 元素距离
    regular4() {
        // icon与两文字的距离大于0, 小于44
        let bool = Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 44)
                    && Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['2'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['2'], 44);
        
        return bool;
    }
}

module.exports = WG3M1;