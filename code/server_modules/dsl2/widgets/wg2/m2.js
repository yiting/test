// (2节点元素)左文字右Icon
//
// (QText) + (QIcon)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class WG2M2 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg2-m2', 1, 1, 0, 0, Common.LvS, Common.QWidget);
    }

    _initNode() {
        let txtNodes = this.getTextNodes();
        let iconNodes = this.getIconNodes();
        
        this._matchNodes['0'] = txtNodes[0];            // txt
        this._matchNodes['1'] = iconNodes[0];           // icon
    }

    // 元素方向
    regular1() {
        // icon位于文字左侧
        let bool = Feature.directionArightToB(this._matchNodes['1'], this._matchNodes['0']);

        return bool;
    }

    // 水平轴方向
    regular2() {
        // icon和txt在主轴上属于水平轴 
        let bool = Feature.baselineABInHorizontal(this._matchNodes['1'], this._matchNodes['0']);

        return bool;
    }

    // 元素距离
    regular3() {
        // icon与txt的距离必须大于0,小于48
        let bool = Feature.distanceGreatAleftToBright(this._matchNodes['1'], this._matchNodes['0'], -4)
                    && Feature.distanceLessAleftToBright(this._matchNodes['1'], this._matchNodes['0'], 48);
        
        return bool;
    }
}

module.exports = WG2M2;