// (3节点元素)左Icon右两文字
//
// (QIcon) + (QText) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class WG3M1 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg3-m1', 2, 1, 0, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  _initNode() {
    const texts: any = this.getTextNodes();
    const icons: any = this.getIconNodes();
    Utils.sortListByParam(texts, 'abY', false);
    const that: any = this;

    const iconsIndex0 = 0;
    that._matchNodes['0'] = icons[iconsIndex0];
    const textsIndex0 = 0;
    that._matchNodes['1'] = texts[textsIndex0];
    const textsIndex1 = 1;
    that._matchNodes['2'] = texts[textsIndex1];
  }

  // 元素方向
  regular1() {
    const that: any = this;
    // icon位于两文字左侧
    const bool =
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['1']) &&
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['2']);

    return bool;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // icon与两文字位于水平轴
    const bool =
      Feature.baselineABInHorizontal(
        that._matchNodes['0'],
        that._matchNodes['1'],
      ) &&
      Feature.baselineABInHorizontal(
        that._matchNodes['0'],
        that._matchNodes['2'],
      );

    return bool;
  }

  regular3() {
    const that: any = this;
    // 两个文字位于垂直轴
    const bool = Feature.baselineGroupAInVertical([
      that._matchNodes['1'],
      that._matchNodes['2'],
    ]);

    return bool;
  }

  // 元素距离
  regular4() {
    const that: any = this;
    // icon与两文字的距离大于0, 小于44
    const bool =
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['0'],
        that._matchNodes['1'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['0'],
        that._matchNodes['1'],
        44,
      ) &&
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['0'],
        that._matchNodes['2'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['0'],
        that._matchNodes['2'],
        44,
      );

    return bool;
  }
}

export default WG3M1;
