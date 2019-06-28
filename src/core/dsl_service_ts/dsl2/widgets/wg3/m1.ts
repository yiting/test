// (3节点元素) 左icon右两text的设计
// (QIcon + QText + QText)
//
// 判断标准
// 1, icon位于text左边
// 2, icon与两text位于水平轴
// 3, 两text位于垂直轴
// 4, icon与两text左右距离大于0小于44
// 5, 两text上下距离大于0小于text高
// 6, icon的高度的1.1倍必须大于两text的高度范围
// 6, && icon的高度的0.7倍必须小于两text的高度范围
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class WG3M1 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg3-m1', 2, 1, 0, 0, Common.LvA, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  _initNode() {
    let texts: any = this.getTextNodes();
    let icons: any = this.getIconNodes();
    Utils.sortListByParam(texts, 'abY', false);

    this._matchNodes['0'] = texts[0];
    this._matchNodes['1'] = texts[1];
    this._matchNodes['2'] = icons[0];
  }

  // 1.
  regular1() {
    let bool: boolean = Feature.directionAleftToB(this._matchNodes['2'], this._matchNodes['0'])
                        && Feature.directionAleftToB(this._matchNodes['2'], this._matchNodes['1']);
    return bool;
  }

  // 2.
  regular2() {
    let bool: boolean = Feature.baselineABInHorizontal(this._matchNodes['2'], this._matchNodes['0'])
                        && Feature.baselineABInHorizontal(this._matchNodes['2'], this._matchNodes['1']);
    return bool;
  }

  // 3.
  regular3() {
    let bool: boolean = Feature.baselineABInVertical(this._matchNodes['0'], this._matchNodes['1']);
    return bool;
  }

  // 4.
  regular4() {
    let gA: any = [this._matchNodes['2']];
    let gB: any = [this._matchNodes['0'], this._matchNodes['1']];

    let bool: boolean = Feature.distanceGreatGroupABInHorizontal(gA, gB, 0)
                        && Feature.distanceLessGroupABInHorizontal(gA, gB, 44);
    return bool;
  }

  // 5.
  regular5() {
    let txtHeight: number = this._matchNodes['0'].height * 1.05;

    let bool: boolean = Feature.distanceGreatAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 0)
                        && Feature.distanceLessAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], txtHeight);
    return bool;
  }

  // 6.
  regular6() {
    let txtAreaHeight: number = Math.abs(this._matchNodes['0'].abY - this._matchNodes['1'].abYops);
    
    let b1: boolean = this._matchNodes['2'].height * 1.1 - txtAreaHeight >= 0? true : false;
    let b2: boolean = this._matchNodes['2'].height * 0.7 - txtAreaHeight <= 0? true : false;
    return (b1 && b2);
  }
}

export default WG3M1;
