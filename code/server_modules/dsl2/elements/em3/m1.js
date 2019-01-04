// (3节点基础元素)左固定长度标签 + 右文字
//
// (QShape+QText)-(QText)
// 
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM3M1 extends Model.ElementModel {
    constructor() {
        // 元素构成规则
        super('em3-m1', 2, 0, 0, 1, Common.LvS, Common.QText);
        this.canLeftFlex = false;
        this.canRightFlex = true;

        // 三个节点记录
        this._tagTxt = null;
        this._mainTxt = null;
        this._tagShape = null;
    }

    // 区分三个基础元素的逻辑
    _initNode() {
        let txtNodes = this.getTextNodes();
        let shapeNodes = this.getShapeNodes();

        if (txtNodes[0].abX >= txtNodes[1].abX) {
            this._mainTxt = txtNodes[0];
            this._tagTxt = txtNodes[1];
        }
        else {
            this._mainTxt = txtNodes[1];
            this._tagTxt = txtNodes[0];
        }
        
        this._tagShape = shapeNodes[0];
    }

    // 元素方向
    regular1() {
        return Feature.directionAleftToB(this._tagTxt, this._mainTxt)
                && Feature.directionAleftToB(this._tagShape, this._mainTxt);
    }

    // 水平轴方向
    regular2() {
        // 三者都处于水平轴方向上
        return Feature.baselineABInHorizontal(this._tagShape, this._mainTxt)
                && Feature.baselineABInHorizontal(this._tagShape, this._tagTxt)
                && Feature.baselineABInHorizontal(this._mainTxt, this._tagTxt);
    }

    // 元素距离
    regular3() {
        // tagShape与mainTxt的距离必须小于22,大于0
        return Feature.distanceGreatArightToBleft(this._tagShape, this._mainTxt, 0)
                && Feature.distanceLessArightToBleft(this._tagShape, this._mainTxt, 22);
    }

    // 位置关系
    regular4() {
        // tagTxt在tagShape的里面并且居中
        return Feature.positionAInBCenter(this._tagTxt, this._tagShape);
    }

    // 尺寸关系
    regular5() {
        // 1. tagShape一般占mainTxt字高度的大于1/2, 小于1.05(1)
        // 2. 文字长度应超过标签长度的一半
        return Feature.sizeHeightRatioAGreatB(this._tagShape, this._mainTxt, 0.5)
                && Feature.sizeHeightRatioALessB(this._tagShape, this._mainTxt, 1.05)
                && Feature.sizeWidthRatioAGreatB(this._tagTxt, this._tagShape, 0.5);
    }
}

module.exports = EM3M1;
