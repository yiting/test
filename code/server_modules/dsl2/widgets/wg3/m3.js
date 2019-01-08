// (3节点元素)上QImage下二QText
//
// (QImage) + (QText) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');
const Utils = require('../../dsl_utils.js');

class WG3M3 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg3-m3', 2, 0, 1, 0, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = true;
    }

    _initNode() {
        let texts = this.getTextNodes();
        let images = this.getImageNodes();
        Utils.sortListByParam(texts, 'abY');

        this._matchNodes['0'] = images[0];          // 图片
        this._matchNodes['1'] = texts[0];           // 文本1
        this._matchNodes['2'] = texts[1];           // 文本2
    }

    // 元素方向
    regular1() {
        // image位于二文字上侧
        let bool = Feature.directionAtopToB(this._matchNodes['0'], this._matchNodes['1'])
                    && Feature.directionAtopToB(this._matchNodes['0'], this._matchNodes['2']);

        return bool;
    }

    // 水平轴方向
    regular2() {
        // 图片与二文字行位于垂直轴
        let bool = Feature.baselineABInVertical(this._matchNodes['0'], this._matchNodes['1'])
                    && Feature.baselineABInVertical(this._matchNodes['0'], this._matchNodes['2']);

        return bool;
    }

    regular3() {
        // 二个文字位于垂直轴
        let bool = Feature.baselineGroupAInVertical([this._matchNodes['1'], this._matchNodes['2']]);
        
        return bool;
    }

    // 元素距离
    regular4() {
        // image与文字与文字之间的间距大于0小于44
        let bool = Feature.distanceGreatAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 0)
                    && Feature.distanceLessAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 44)
                    && Feature.distanceGreatAbottomToBtop(this._matchNodes['1'], this._matchNodes['2'], 0)
                    && Feature.distanceLessAbottomToBtop(this._matchNodes['1'], this._matchNodes['2'], 44);
        
        return bool;
    }

    // 尺寸关系
    regular5() {
        // 文字必须小于图片的长度
        let bool = Feature.sizeWidthRatioALessB(this._matchNodes['1'], this._matchNodes['0'], 1.1)
                    && Feature.sizeWidthRatioALessB(this._matchNodes['2'], this._matchNodes['0'], 1.1);

        return bool;
    }
}

module.exports = WG3M3;