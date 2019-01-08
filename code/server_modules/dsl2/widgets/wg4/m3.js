// (4节点元素)左三张图右一文字
//
// (QImage) + (QImage) + (QImage) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');
const Utils = require('../../dsl_utils.js');

class WG4M3 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg4-m3', 1, 0, 3, 0, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = true;
    }

    _initNode() {
        let texts = this.getTextNodes();
        let images = this.getImageNodes();
        // 排序image
        Utils.sortListByParam(images, 'abX');
        
        this._matchNodes['0'] = images[0];          // 图片1
        this._matchNodes['1'] = images[1];          // 图片2
        this._matchNodes['2'] = images[2];          // 图片3

        this._matchNodes['3'] = texts[0];           // 文本1
    }

     // 元素方向
     regular1() {
        // 3个图片位于1个文字左边
        let images = [this._matchNodes['0'], this._matchNodes['1'], this._matchNodes['2']];
        let texts = [this._matchNodes['3']];
        let bool = Feature.directionGroupAleftToGroupB(images, texts);
        
        return bool;
    }

    // 水平轴方向
    regular2() {
        // 3个图片元素位于水平轴
        let images = [this._matchNodes['0'], this._matchNodes['1'], this._matchNodes['2']];
        let bool = Feature.baselineGroupAInHorizontal(images);

        return bool;
    }

    // 水平轴方向
    regular3() {
        let images = [this._matchNodes['0'], this._matchNodes['1'], this._matchNodes['2']];
        let bool = Feature.baselineGroupAcontainBInHorizontal(images, this._matchNodes['3']);
        
        return bool;
    }

    // 元素距离
    regular4() {
        // image之间的间距大于等于0, 44
        let bool = Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 44)
                    && Feature.distanceGreatArightToBleft(this._matchNodes['1'], this._matchNodes['2'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['1'], this._matchNodes['2'], 44);
       
        return bool;
    }

    // 元素距离
    regular5() {
        // 文字与图片之间的距离
        let bool = Feature.distanceGreatArightToBleft(this._matchNodes['2'], this._matchNodes['3'], 0)
                    && Feature.distanceLessArightToBleft(this._matchNodes['2'], this._matchNodes['3'], 44);
        
        return bool;
    }
}

module.exports = WG4M3;
