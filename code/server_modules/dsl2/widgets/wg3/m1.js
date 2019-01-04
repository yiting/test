// (3节点元素)左Icon右文字
//
// (QIcon) + (QText) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class WG3M1 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg3-m1', 2, 1, 0, 0, Common.LvS, Common.QWidget);

        // 节点记录
        this._matchNodes['0'] = null;         // icon
        // 节点记录
        this._matchNodes['1'] = null;         // mainTxt
        this._matchNodes['2'] = null;         // subTxt
    }

    _initNode() {
        let txtNodes = this.getTextNodes();
        let iconNodes = this.getIconNodes();
        // 因为只有两个节点
        if (txtNodes[0].height > txtNodes[1].height) {
            this._matchNodes['1'] = txtNodes[0];
            this._matchNodes['2'] = txtNodes[1];
        }
        else {
            this._matchNodes['1'] = txtNodes[1];
            this._matchNodes['2'] = txtNodes[0];
        }

        this._matchNodes['0'] = iconNodes[0];
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