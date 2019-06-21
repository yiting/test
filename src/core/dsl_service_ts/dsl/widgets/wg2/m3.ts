// (2节点元素)上Icon下文字
//
// (QText) + (QIcon)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class WG2M3 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg2-m3', 1, 1, 0, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const txtNodes = this.getTextNodes();
    const iconNodes = this.getIconNodes();
    const that: any = this;

    const iconNodesIndex0 = 0;
    that._matchNodes['0'] = iconNodes[iconNodesIndex0]; // icon
    const txtNodesIndex0 = 0;
    that._matchNodes['1'] = txtNodes[txtNodesIndex0]; // txt
  }

  // 元素方向
  regular1() {
    const that: any = this;
    // 文字位于icon下面
    return Feature.directionAbottomToB(
      that._matchNodes['1'],
      that._matchNodes['0'],
    );
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // icon和txt在主轴上属于垂直轴
    return Feature.baselineABInVertical(
      that._matchNodes['0'],
      that._matchNodes['1'],
    );
  }

  // 元素距离
  regular3() {
    const that: any = this;
    // icon与txt的距离必须大于0,小于100
    return (
      Feature.distanceGreatAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        -4,
      ) &&
      Feature.distanceLessAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        40,
      )
    );
  }
}

export default WG2M3;
