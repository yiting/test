// (4节点元素)左QImage右三QText
//
// (QImage) + (QText) + (QText) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');
const Utils = require('../../dsl_utils.js');

class WG4M1 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg4-m1', 3, 0, 1, 0, Common.LvS, Common.QWidget);
    }

    // 匹配到的节点做记录
    _initNode() {
        this._matchNodes['0'] = this.getImageNodes()[0];        // 图片
        let texts = this.getTextNodes();
        // 排序text
        Utils.sortListByParam(texts, 'abY');

        this._matchNodes['1'] = texts[0];                       // 文本1
        this._matchNodes['2'] = texts[1];                       // 文本2
        this._matchNodes['3'] = texts[2];                       // 文本3
    }

    // 元素方向
    regular1() {
        // image位于三文字左侧
        let bool = Feature.directionAleftToB(this._matchNodes['0'], this._matchNodes['1'])
                    && Feature.directionAleftToB(this._matchNodes['0'], this._matchNodes['2'])
                    && Feature.directionAleftToB(this._matchNodes['0'], this._matchNodes['3']);

        return bool;
    }

    // 水平轴方向
    regular2() {
        // 图片与三文字行位于水平轴
        let bool = Feature.baselineABInHorizontal(this._matchNodes['0'], this._matchNodes['1'])
                    && Feature.baselineABInHorizontal(this._matchNodes['0'], this._matchNodes['2'])
                    && Feature.baselineABInHorizontal(this._matchNodes['0'], this._matchNodes['3']);

        return bool;
    }

    regular3() {
        // 三个文字位于垂直轴
        let bool = Feature.baselineGroupAInVertical([this._matchNodes['1'], this._matchNodes['2'], this._matchNodes['3']]);
        
        return bool;
    }

    // 元素距离
    regular4() {
        // image与三个文字的距离大于0, 小于44
        let bool = Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 44)
                    && Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['2'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['2'], 44)
                    && Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['3'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['3'], 44);
        
        return bool;
    }
}

module.exports = WG4M1;