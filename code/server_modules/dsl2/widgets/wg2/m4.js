// (2节点元素)上图片下文字
//
// (QImage) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class WG2M4 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg2-m4', 1, 0, 1, 0, Common.LvSS, Common.QWidget);

        // 节点记录
        this._matchNodes['0'] = null;         // image
        this._matchNodes['1'] = null;         // txt
    }

    _initNode() {
        let txtNodes = this.getTextNodes();
        let imageNodes = this.getImageNodes();
        
        this._matchNodes['0'] = imageNodes[0];
        this._matchNodes['1'] = txtNodes[0];
    }

    // 元素方向
    regular1() {
        // 文字位于图片下面
        return Feature.directionAbottomToB(this._matchNodes['1'], this._matchNodes['0']);
    }

    // 水平轴方向
    regular2() {
        // image和txt在主轴上属于垂直轴 
        return Feature.baselineABInVertical(this._matchNodes['0'], this._matchNodes['1']);
    }

    // 元素距离
    regular3() {
        // icon与txt的距离必须大于0,小于50
        return Feature.distanceGreatAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 0)
                && Feature.distanceLessAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 25);
    }
}

module.exports = WG2M4;