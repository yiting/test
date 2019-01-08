// (2节点基础元素) 上文字 + 下下划线(shape)
//
// (QText)-(QShape)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM2M4 extends Model.ElementModel {
    constructor() {
        // 元素构成规则
        super('em2-m4', 1, 0, 0, 1, Common.LvA, Common.QText);

        this.canLeftFlex = false;
        this.canRightFlex = false;
    }

    _initNode() {
        let shapes = this.getShapeNodes();
        let texts = this.getTextNodes();
    
        this._matchNodes['0'] = texts[0];           // Text
        this._matchNodes['1'] = shapes[0];          // Shape
    }

    // 位置关系
    regular1() {
        // 下划线位于文字下面
        let bool = Feature.directionAbottomToB(this._matchNodes['1'], this._matchNodes['0']);

        return bool;
    }

    // 元素主轴关系
    regular2() {
        // 下划线和文字在垂直位置
        let bool = Feature.baselineABInVertical(this._matchNodes['0'], this._matchNodes['1']);

        return bool;
    }

    // 距离关系
    regular3() {
        // 下划线与文字的距离大于0, 小于文字的高
        let height = this._matchNodes['0'].height;
        let bool = Feature.distanceLessAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], height)
                    && Feature.distanceGreatAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 0);
        
        return bool;
    }

    // 尺寸关系
    regular4() {
        // 下划线的高度必须小于20
        let height = this._matchNodes['1'].height;
        let bool = height <= 20? true : false;
        
        return bool;
    }

    // 尺寸关系
    regular5() {
        let bool = Feature.sizeWidthRatioALessB(this._matchNodes['1'], this._matchNodes['0'], 2)
                    && Feature.sizeWidthRatioAGreatB(this._matchNodes['1'], this._matchNodes['0'], 0.5);
        
        return bool;
    }
}

module.exports = EM2M4;