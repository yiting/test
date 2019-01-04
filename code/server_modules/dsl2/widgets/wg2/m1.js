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
        super('wg2-m1', 1, 1, 0, 0, Common.LvSS, Common.QWidget);

        // 节点记录
        this._iconNode = null;
        this._mainTxt = null;
    }

    _initNode() {
        let txtNodes = this.getTextNodes();
        let iconNodes = this.getIconNodes();
        
        this._iconNode = iconNodes[0];
        this._mainTxt = txtNodes[0];
    }

    // 元素方向
    regular1() {
        // icon位于文字左侧
        return Feature.directionAleftToB(this._iconNode, this._mainTxt);
    }

    // 水平轴方向
    regular2() {
        // icon和txt在主轴上属于水平轴 
        return Feature.baselineABInHorizontal(this._iconNode, this._mainTxt);
    }

    // 元素距离
    regular3() {
        // icon与txt的距离必须大于0,小于100
        return Feature.distanceGreatArightToBleft(this._iconNode, this._mainTxt, -4)
                && Feature.distanceLessArightToBleft(this._iconNode, this._mainTxt, 40);
    }
}

module.exports = WG2M1;