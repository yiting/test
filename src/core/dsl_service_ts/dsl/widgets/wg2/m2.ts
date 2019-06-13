// (2节点元素)左文字右Icon
//
// (QText) + (QIcon)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class WG2M2 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg2-m2', 1, 1, 0, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  _initNode() {
    const txtNodes = this.getTextNodes();
    const iconNodes = this.getIconNodes();
    const that: any = this;

    const txtNodesIndex0 = 0;
    that._matchNodes['0'] = txtNodes[txtNodesIndex0]; // txt
    const iconNodesIndex0 = 0;
    that._matchNodes['1'] = iconNodes[iconNodesIndex0]; // icon
  }

  // 元素方向
  regular1() {
    const that: any = this;

    // icon位于文字左侧
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
      that._matchNodes['1'],
      that._matchNodes['0'],
    );

    return bool;
  }

  // 元素距离
  regular3() {
    const that: any = this;
    // icon与txt的距离必须大于0,小于48
    const bool =
      Feature.distanceGreatAleftToBright(
        that._matchNodes['1'],
        that._matchNodes['0'],
        -4,
      ) &&
      Feature.distanceLessAleftToBright(
        that._matchNodes['1'],
        that._matchNodes['0'],
        48,
      );

    return bool;
  }
}

export default WG2M2;
