// (2节点元素)左Icon右文字
//
// (QIcon) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class WG2M1 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg2-m1', 1, 1, 0, 0, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = true;
    }

    _initNode() {
        let texts = this.getTextNodes();
        let icons = this.getIconNodes();
        
        this._matchNodes['0'] = icons[0];           // icon
        this._matchNodes['1'] = texts[0];            // txt
    }

    // 元素方向
    regular1() {
        // icon位于文字左侧
        let bool = Feature.directionAleftToB(this._matchNodes['0'], this._matchNodes['1']);
        
        return bool;
    }

    // 水平轴方向
    regular2() {
        // icon和txt在主轴上属于水平轴 
        let bool = Feature.baselineABInHorizontal(this._matchNodes['0'], this._matchNodes['1']);

        return bool;
    }

    // 元素距离
    regular3() {
        // icon与txt的距离必须大于0,小于48
        let bool = Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['1'], -4)
                && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 48);

        return bool;
    }
}

module.exports = WG2M1;