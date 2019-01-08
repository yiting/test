// (5节点元素)左三张图右两文字
//
// (QImage) + (QImage) + (QImage) + (QText) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class WG5M1 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg5-m1', 1, 0, 3, 0, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = true;

        // 节点记录
        this._images = null;                // 所有的图片
        this._texts = null;                 // 所有的txt
    }

    _initNode() {
        // 3个图片元素
        this._images = this.getImageNodes();
        // 2个文字元素
        this._texts = this.getTextNodes();
    }

    // 元素方向
    regular1() {
        // 3个图片位于2个文字左边
        return Feature.directionGroupAleftToGroupB(this._images, this._texts);
    }

    // 水平轴方向
    regular2() {
        // 3个图片元素位于水平轴
        return Feature.baselineGroupAInHorizontal(this._images);
    }

    regular3() {
        // 2个文字元素位于垂直轴
        return Feature.baselineGroupAInVertical(this._texts);
    }

    regular4() {
        // 图片组分别与2个文字相交
        return Feature.baselineGroupABInHorizontal(this._images, this._texts);
    }

    regular5() {
        // console.log(this._texts[0].abY);
        // console.log(this._texts[1].abY);
        // return true;
        return Feature.baselineGroupAcontainBInHorizontal(this._images, this._texts[0]);
                //&& feature.baselineGroupAcontainBInHorizontal(this._images, this._texts[1]);
    }

    // 元素距离
    regular6() {
        // 组A与组B的的距离大于0, 小于100
        return Feature.distanceGreatGroupABInHorizontal(this._images, this._texts, 0)
                && Feature.distanceLessGroupABInHorizontal(this._images, this._texts, 100);
    }
}


module.exports = WG5M1;

