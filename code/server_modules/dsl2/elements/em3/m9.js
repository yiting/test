// (3节点基础元素) 连续标签组件
//
// (QText)-(QShape)-(QText)
// 
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Feature = require('../../dsl_feature.js');

class EM3M9 extends Model.ElementModel {
    constructor() {
        // 元素构成规则
        super('em3-m9', 2, 0, 0, 1, Common.LvS, Common.QText);
    
        // 三个节点记录
        this._matchNodes['0'] = null;       // 文本
        this._matchNodes['1'] = null;       // 分割线
        this._matchNodes['2'] = null;       // 文本
    }

    // 区分三个基础元素的逻辑
    _initNode() {
        let txtNodes = this.getTextNodes();
        let shapeNodes = this.getShapeNodes();

        if (txtNodes[0].abX <= txtNodes[1].abX) {
            this._matchNodes['0'] = txtNodes[0];
            this._matchNodes['2'] = txtNodes[1];
        }
        else {
            this._matchNodes['0'] = txtNodes[1];
            this._matchNodes['2'] = txtNodes[0];
        }

        this._matchNodes['1'] = shapeNodes[0];
    }

    // 元素方向
    regular1() {
        let res = Feature.directionAleftToB(this._matchNodes['0'], this._matchNodes['1'])
                  && Feature.directionAleftToB(this._matchNodes['1'], this._matchNodes['2']);

        return res;
    }

    // 水平轴方向
    regular2() {
        // 三者处于水平轴方向上
        let res = Feature.baselineGroupAInHorizontal([this._matchNodes['0'], this._matchNodes['2'], this._matchNodes['1']]);
    
        return res;
    }

    // 元素距离
    regular3() {
        // 文字与分割线大于0, 小于22
        let res = Feature.distanceGreatArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 0)
                  && Feature.distanceLessArightToBleft(this._matchNodes['0'], this._matchNodes['1'], 22)
                  && Feature.distanceGreatArightToBleft(this._matchNodes['1'], this._matchNodes['2'], 0)
                  && Feature.distanceLessArightToBleft(this._matchNodes['1'], this._matchNodes['2'], 22);
                  
        return res;
    }

    // 尺寸关系
    regular4() {
        // 分割线是icon, 但宽度小于4, 高度小于文字高度*1.1
        let height = this._matchNodes['0'].height * 1.1;
        let res = Feature.sizeWidthLess(this._matchNodes['1'], 4)
                  && Feature.sizeHeightLess(this._matchNodes['1'], height);

        return res;
    }
}

module.exports = EM3M9;
