// (2节点元素) 上icon下text的图标说明设计
// (QIcon + QText)
//
// 判断标准
// 1, icon在文字上方,
// 2, icon和文字位于垂直轴上
// 3, icon和文字的间距少于文字高度
// 4, 文字的长度不大于icon的长度
// 5, 文字的长度不小于icon的长度的一半
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class WG2M1 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg2-m1', 1, 1, 0, 0, Common.LvA, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = false;
    }

    _initNode() {
        let icons: any = this.getShapeNodes();
        let texts: any = this.getTextNodes();

        this._matchNodes['0'] = icons[0];
        this._matchNodes['1'] = texts[0];
    }

    // 1.
    regular1() {
        let bool = Feature.directionAtopToB(this._matchNodes['0'], this._matchNodes['1']);
        return bool;
    }
    // 2.
    regular2() {
        let bool = Feature.baselineABInVertical(this._matchNodes['0'], this._matchNodes['1']);
        return bool;
    }
    // 3
    regular3() {
        let txtHeight = this._matchNodes['1'].height;
        let bool = Feature.distanceLessAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], txtHeight);
        return bool;
    }
    // 4
    regular4() {
        let bool = Feature.sizeWidthRatioALessB(this._matchNodes['1'], this._matchNodes['0'], 1);
        return bool;
    }
    // 5
    regular5() {
        let bool = Feature.sizeWidthRatioAGreatB(this._matchNodes['1'], this._matchNodes['0'], 0.5);
        return bool;
    }
}

export default WG2M1;