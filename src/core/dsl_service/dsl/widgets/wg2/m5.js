// (2节点元素)上标题下文字描述
//
// (QText) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class WG2M5 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg2-m5', 2, 0, 0, 0, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = true;
        
        // 节点记录
        this._matchNodes['1'] = null;           // sub txt
        this._matchNodes['0'] = null;           // main txt
    }

    _initNode() {
        let txtNodes = this.getTextNodes();
        // 因为只有两个节点
        if (txtNodes[0].height > txtNodes[1].height) {
            this._matchNodes['0'] = txtNodes[0];
            this._matchNodes['1'] = txtNodes[1];
        }
        else {
            this._matchNodes['0'] = txtNodes[1];
            this._matchNodes['1'] = txtNodes[0];
        }
    }

    // 重要一个是两个文字不能字号相等
    regular1() {
        return this._matchNodes['0'].height != this._matchNodes['1'].height;
    }

    // 元素方向
    regular2() {
        return Feature.directionAbottomToB(this._matchNodes['1'], this._matchNodes['0']);
    }

    // 水平轴方向
    regular3() {
        // 两个文字在垂直轴方向
        return Feature.baselineABInVertical(this._matchNodes['1'], this._matchNodes['0']);
    }

    // 元素距离
    regular4() {
        // 大标题与小标题的距离必须大于0, 小于小标题的高度
        return Feature.distanceGreatAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 0)
                && Feature.distanceLessAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], this._matchNodes['1'].height);
    }
}

module.exports = WG2M5;