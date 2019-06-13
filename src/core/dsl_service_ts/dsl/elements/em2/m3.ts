// (2节点基础元素)左标签右文字
//
// (QIcon)-(QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM2M3 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em2-m3', 1, 1, 0, 0, Common.LvA, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  _initNode() {
    const texts = this.getTextNodes();
    const icons = this.getIconNodes();
    const that: any = this;

    const textsIndex0 = 0;
    that._matchNodes['0'] = texts[textsIndex0]; // 文本
    const iconsIndex0 = 0;
    that._matchNodes['1'] = icons[iconsIndex0]; // icon
  }

  // 元素方向
  regular1() {
    const that: any = this;

    // 文字位于图标
    return Feature.directionArightToB(
      that._matchNodes['0'],
      that._matchNodes['1'],
    );
  }

  // 水平轴方向
  regular2() {
    const that: any = this;

    // icon和txt在主轴上属于水平轴
    return Feature.baselineABInHorizontal(
      that._matchNodes['0'],
      that._matchNodes['1'],
    );
  }

  // 元素距离
  regular3() {
    const that: any = this;

    // icon与txt的距离必须大于0,小于22
    return (
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['1'],
        that._matchNodes['0'],
        -4,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['1'],
        that._matchNodes['0'],
        24,
      )
    );
  }

  // 尺寸关系
  regular4() {
    const that: any = this;

    // 1. 图标一般占mainTxt字高度的大于1/2, 小于1.05(1)
    return (
      Feature.sizeHeightRatioAGreatB(
        that._matchNodes['1'],
        that._matchNodes['0'],
        0.5,
      ) &&
      Feature.sizeHeightRatioALessB(
        that._matchNodes['1'],
        that._matchNodes['0'],
        1.1,
      )
    );
  }
}

export default EM2M3;
