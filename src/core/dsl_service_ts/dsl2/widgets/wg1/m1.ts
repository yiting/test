// (1节点元素)水平分割线
// (QShape)
//
// 判断标准
// 1, 长度大于设计稿宽的80%;
// 2, 高度小于4px
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Store from '../../../helper/store';

let designWidth: number = 0;
class WG1M1 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg1-m1', 0, 0, 0, 1, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = false;
    designWidth = Store.get('designWidth');
  }

  _initNode() {
    let shapes: any = this.getShapeNodes();
    this._matchNodes['0'] = shapes[0];
  }

  // 元素大小
  regular1() {
    let bool = Feature.sizeWidthGreat(this._matchNodes['0'], designWidth * 0.6);
    return bool;
  }

  regular2() {
    let bool = Feature.sizeHeightLess(this._matchNodes['0'], 4);
    return bool;
  }
}

export default WG1M1;
