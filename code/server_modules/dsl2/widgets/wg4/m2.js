// (4节点元素) 上面三QImage + 下面一Text
//
// ((QImage) + (QImage) + (QImage)) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');
const Utils = require('../../dsl_utils.js');

class WG4M2 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg4-m2', 1, 0, 3, 0, Common.LvS, Common.QWidget);

        // 节点记录
        this._matchNodes['0'] = null;       // 图片1
        this._matchNodes['1'] = null;       // 图片2
        this._matchNodes['2'] = null;       // 图片3
        this._matchNodes['3'] = null;       // 文本1
    }

    // 匹配到的节点做记录
    _initNode() {
        let images = this.getImageNodes();
        let texts = this.getTextNodes();
        // 横向排列image
        Utils.sortListByParam(images, 'abX');

        this._matchNodes['0'] = images[0];
        this._matchNodes['1'] = images[1];
        this._matchNodes['2'] = images[2];
        this._matchNodes['3'] = texts[0];
    }

    // 元素方向
    regular1() {
        // 文本位于图片下面
        let bool = Feature.directionAbottomToB(this._matchNodes['3'], this._matchNodes['0'])
                    && Feature.directionAbottomToB(this._matchNodes['3'], this._matchNodes['1'])
                    && Feature.directionAbottomToB(this._matchNodes['3'], this._matchNodes['2']);

        return bool;
    }

    // 水平轴方向
    regular2() {
        // 三个图片位于水平轴
        let group = [this._matchNodes['0'], this._matchNodes['1'], this._matchNodes['2']];
        let bool = Feature.baselineGroupAInHorizontal(group);

        return bool;
    }

    // 元素距离
    regular3() {
        // image之间的间距大于等于0, 44
        let bool = Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 44)
                    && Feature.distanceGreatArightToBleft(this._matchNodes['1'], this._matchNodes['2'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['1'], this._matchNodes['2'], 44);
                
        return bool;
    }

    regular4() {
        // 文本与image之间的间距大于0, 小于44
        let bool = Feature.distanceGreatAtopToBbottom(this._matchNodes['3'], this._matchNodes['0'], 0)
                    && Feature.distanceLessAtopToBbottom(this._matchNodes['3'], this._matchNodes['0'], 44)
                    && Feature.distanceGreatAtopToBbottom(this._matchNodes['3'], this._matchNodes['1'], 0)
                    && Feature.distanceLessAtopToBbottom(this._matchNodes['3'], this._matchNodes['1'], 44)
                    && Feature.distanceGreatAtopToBbottom(this._matchNodes['3'], this._matchNodes['2'], 0)
                    && Feature.distanceLessAtopToBbottom(this._matchNodes['3'], this._matchNodes['2'], 44);

        return bool;
    }

    regular5() {
        // 文本必须超过第一张图片的长度 + 间距
        let bool = Feature.sizeWidthRatioAGreatB(this._matchNodes['3'], this._matchNodes['0'], 1.25);

        return bool;
    }
}

module.exports = WG4M2;