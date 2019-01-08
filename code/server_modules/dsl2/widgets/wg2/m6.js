// (2节点元素) QShape作为背景的按钮
//
// (QShape) + (QText)
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class WG2M6 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg2-m6', 1, 0, 0, 1, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = false;

        // 节点记录
        this._matchNodes['0'] = null;           // shape
        this._matchNodes['1'] = null;           // txt
    }

    _initNode() {
        let shapeNodes = this.getShapeNodes();
        let txtNodes = this.getTextNodes();
        
        this._matchNodes['0'] = shapeNodes[0];
        this._matchNodes['1'] = txtNodes[0];
    }

    // 文本在背景图中间位置
    regular1() {
        let bool = Feature.positionAInBCenter(this._matchNodes['1'], this._matchNodes['0']);

        return bool;
    }
}

module.exports = WG2M6;