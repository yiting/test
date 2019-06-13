// (1节点元素)水平分割线
//
// (QShape)
//
import { debug } from 'util';
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class WG1M1 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg1-m1', 0, 0, 0, 1, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const that: any = this;
    const shapeIndex0 = 0;
    that._matchNodes['0'] = this.getShapeNodes()[shapeIndex0];
  }

  // 元素方向
  regular1() {
    const that: any = this;
    const isTrue =
      Feature.sizeHeightLess(
        that._matchNodes['0'],
        Common.DesignWidth * 0.054,
      ) &&
      Feature.sizeWidthGreat(that._matchNodes['0'], Common.DesignWidth * 0.8);
    return isTrue;
  }
}

export default WG1M1;
