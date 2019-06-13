// (2节点基础元素)QImage下 - QText上
//
// 这里用于匹配QImage下 - QText上的设计形态, 至于是否要分拆出形态待后面讨论
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM2M7 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em2-m7', 1, 0, 1, 0, Common.LvA, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const images = this.getImageNodes();
    const texts = this.getTextNodes();
    const that: any = this;

    const imagesIndex0 = 0;
    that._matchNodes['0'] = images[imagesIndex0]; // image
    const textsIndex0 = 0;
    that._matchNodes['1'] = texts[textsIndex0]; // text
  }

  // 位置关系
  regular1() {
    const that: any = this;

    const bool = Feature.positionAInBCenter(
      that._matchNodes['1'],
      that._matchNodes['0'],
    );

    return bool;
  }

  // 尺寸关系
  regular2() {
    const that: any = this;

    const bool =
      Feature.sizeHeightRatioALessB(
        that._matchNodes['0'],
        that._matchNodes['1'],
        2,
      ) &&
      Feature.sizeHeightRatioAGreatB(
        that._matchNodes['0'],
        that._matchNodes['1'],
        1,
      );

    return bool;
  }
}

export default EM2M7;
