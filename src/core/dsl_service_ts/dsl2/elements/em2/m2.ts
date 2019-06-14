// 以Shape为底,Text在里面的tag结构
//
// (QShape)-(QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM2M2 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em2-m2', 1, 0, 0, 1, Common.LvA, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const texts = this.getTextNodes();
    const shapes = this.getShapeNodes();
    const that: any = this;

    const textsIndex0 = 0;
    that._matchNodes['0'] = texts[textsIndex0]; // QText
    const shapesIndex0 = 0;
    that._matchNodes['1'] = shapes[shapesIndex0]; // QImage
  }

  // 位置关系
  regular1() {
    const that: any = this;

    const bool = Feature.positionAInBCenter(
      that._matchNodes['0'],
      that._matchNodes['1'],
    );

    return bool;
  }

  // 尺寸关系
  regular2() {
    // 1. 文字高度占图形超 1/2
    // 2. 文字长度占图形超 7/10
    const that: any = this;

    const bool =
      Feature.sizeHeightRatioAGreatB(
        that._matchNodes['0'],
        that._matchNodes['1'],
        0.5,
      ) &&
      Feature.sizeWidthRatioAGreatB(
        that._matchNodes['0'],
        that._matchNodes['1'],
        0.7,
      );

    return bool;
  }

  // 高度必须小于40
  regular3() {
    let bool = Feature.sizeHeightLess(this._matchNodes['1'], 40);

    return bool;
  }
}

export default EM2M2;
