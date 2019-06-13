// (2节点元素)左Icon右文字
//
// (QIcon) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class WG2M1 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg2-m1', 1, 1, 0, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  _initNode() {
    const texts = this.getTextNodes();
    const icons = this.getIconNodes();
    const that: any = this;

    const iconsIndex0 = 0;
    that._matchNodes['0'] = icons[iconsIndex0]; // icon
    const textsIndex0 = 0;
    that._matchNodes['1'] = texts[textsIndex0]; // txt
  }

  // 元素方向
  regular1() {
    // icon位于文字左侧
    const that: any = this;

    const bool = Feature.directionAleftToB(
      that._matchNodes['0'],
      that._matchNodes['1'],
    );

    return bool;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // icon和txt在主轴上属于水平轴
    const bool = Feature.baselineABInHorizontal(
      that._matchNodes['0'],
      that._matchNodes['1'],
    );

    return bool;
  }

  // 元素距离
  regular3() {
    const that: any = this;
    // icon与txt的距离必须大于0,小于48
    const bool =
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['0'],
        that._matchNodes['1'],
        -4,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['0'],
        that._matchNodes['1'],
        48,
      );

    return bool;
  }
}

export default WG2M1;
