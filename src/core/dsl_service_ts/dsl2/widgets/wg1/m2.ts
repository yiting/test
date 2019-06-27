// (1节点元素)水平分割线
// (QImage)
//
// 判断标准
// 1, 长度大于设计稿宽的80%;
// 2, 高度小于4px
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class WG1M2 extends Model.WidgetModel {
    constructor() {
        // 元素构成规则
        super('wg1-m2', 0, 0, 1, 0, Common.LvS, Common.QWidget);
        this.canLeftFlex = false;
        this.canRightFlex = false;
    }

    _initNode() {
        let images: any = this.getImageNodes();
        this._matchNodes['0'] = images[0];
    }

    // 元素大小
    regular1() {
        let bool = Feature.sizeWidthGreat(this._matchNodes['0'], Common.DesignWidth * 0.6);
        return bool;
    }

    regular2() {
        let bool = Feature.sizeHeightLess(this._matchNodes['0'], 4);
        return bool;
    }
}

export default WG1M2;