// (2节点基础元素)QShape下 - QText 上
//
// (QText)-(QShape)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM2M6 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em2-m6', 1, 0, 0, 1, Common.LvA, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const shapes = this.getShapeNodes();
    const texts = this.getTextNodes();
    const that: any = this;

    const textsIndex0 = 0;
    that._matchNodes['0'] = texts[textsIndex0]; // Text
    const shapesIndex0 = 0;
    that._matchNodes['1'] = shapes[shapesIndex0]; // Shape
  }

  // 位置关系
  regular1() {
    const that: any = this;

    // 下划线位于文字下面
    const bool = Feature.directionAbottomToB(
      that._matchNodes['1'],
      that._matchNodes['0'],
    );

    return bool;
  }

  // 元素主轴关系
  regular2() {
    const that: any = this;

    // 下划线和文字在垂直位置
    const bool = Feature.baselineABInVertical(
      that._matchNodes['0'],
      that._matchNodes['1'],
    );

    return bool;
  }

  // 距离关系
  regular3() {
    const that: any = this;

    // 下划线与文字的距离大于0, 小于文字的高
    const { height } = that._matchNodes['0'];
    const bool =
      Feature.distanceLessAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        height,
      ) &&
      Feature.distanceGreatAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        0,
      );

    return bool;
  }

  // 尺寸关系
  regular4() {
    const that: any = this;

    // 下划线的高度必须小于20
    const { height } = that._matchNodes['1'];
    const bool = height <= 20;

    return bool;
  }

  // 尺寸关系
  regular5() {
    const that: any = this;

    const bool =
      Feature.sizeWidthRatioALessB(
        that._matchNodes['1'],
        that._matchNodes['0'],
        2,
      ) &&
      Feature.sizeWidthRatioAGreatB(
        that._matchNodes['1'],
        that._matchNodes['0'],
        0.5,
      );

    return bool;
  }
}

export default EM2M6;
