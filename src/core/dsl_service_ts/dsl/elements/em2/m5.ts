// (2节点基础元素)QShape下 - QText 上
//
// (QText)-(QShape)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM2M5 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em2-m5', 1, 0, 0, 1, Common.LvA, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const shapes = this.getShapeNodes();
    const texts = this.getTextNodes();
    const that: any = this;

    const shapesIndex0 = 0;
    that._matchNodes['0'] = shapes[shapesIndex0]; // shape
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
        2.4,
      ) &&
      Feature.sizeHeightRatioAGreatB(
        that._matchNodes['0'],
        that._matchNodes['1'],
        1,
      );

    return bool;
  }
}

export default EM2M5;
