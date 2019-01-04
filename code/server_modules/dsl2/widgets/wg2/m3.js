// (2节点元素)上Icon下文字
//
// (QText) + (QIcon)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class WG2M3 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg2-m3', 1, 1, 0, 0, Common.LvSS, Common.QWidget);

        // 节点记录
        this._matchNodes['0'] = null;          // icon
        this._matchNodes['1'] = null;          // txt
    }

    _initNode() {
        let txtNodes = this.getTextNodes();
        let iconNodes = this.getIconNodes();
        
        this._matchNodes['0'] = iconNodes[0];
        this._matchNodes['1'] = txtNodes[0];
    }

    // 元素方向
    regular1() {
        // 文字位于icon下面
        return Feature.directionAbottomToB(this._matchNodes['1'], this._matchNodes['0']);
    }

    // 水平轴方向
    regular2() {
        // icon和txt在主轴上属于垂直轴 
        return Feature.baselineABInVertical(this._matchNodes['0'], this._matchNodes['1']);
    }

    // 元素距离
    regular3() {
        // icon与txt的距离必须大于0,小于100
        return Feature.distanceGreatAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], -4)
                && Feature.distanceLessAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 40);
    }
}

module.exports = WG2M3;