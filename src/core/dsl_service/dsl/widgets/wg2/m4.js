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
        super('wg2-m4', 1, 0, 1, 0, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = false;

        // 节点记录
        this._matchNodes['0'] = null; // image
        this._matchNodes['1'] = null; // txt
    }

    _initNode() {
        let txtNodes = this.getTextNodes();
        let imageNodes = this.getImageNodes();

        this._matchNodes['0'] = imageNodes[0];
        this._matchNodes['1'] = txtNodes[0];
    }

    // 元素位置
    regular1() {
        // 文字位于图片下面
        return Feature.directionAbottomToB(this._matchNodes['1'], this._matchNodes['0']) &&
            // image和txt在主轴上属于垂直轴 
            Feature.baselineABInVertical(this._matchNodes['0'], this._matchNodes['1']);
    }

    // 元素距离关系
    regular2() {
        // 图片与txt的距离必须大于-4,小于50
        return Feature.distanceGreatAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], -4) &&
            Feature.distanceLessAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 25) &&
            // 左对齐
            (
                Feature.baselineABJustifyLeft(this._matchNodes['0'], this._matchNodes['1'], 2) ||
                Feature.baselineABJustifyCenter(this._matchNodes['0'], this._matchNodes['1'], 4)
            )
    }
}

module.exports = WG2M4;