// (3节点基础元素)左可变长度标签 + 右文字
//
// (QShape+QText)-(QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class EM3M7 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em3-m7', 2, 0, 0, 1, Common.LvS, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  // 区分三个基础元素的逻辑
  _initNode() {
    const texts: any = this.getTextNodes();
    const shapes: any = this.getShapeNodes();
    Utils.sortListByParam(texts, 'abX', false);
    const that: any = this;

    const shapesIndex0 = 0;
    that._matchNodes['0'] = shapes[shapesIndex0]; // tag的shape背景
    const textsIndex0 = 0;
    that._matchNodes['1'] = texts[textsIndex0]; // tag的文字
    const textsIndex1 = 1;
    that._matchNodes['2'] = texts[textsIndex1]; // 主文字
  }

  // 元素方向
  regular1() {
    const that: any = this;
    const bool =
      Feature.directionAleftToB(that._matchNodes['1'], that._matchNodes['2']) &&
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['2']);

    return bool;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // 三者都处于水平轴方向上
    const group = [
      that._matchNodes['0'],
      that._matchNodes['1'],
      that._matchNodes['2'],
    ];
    const bool = Feature.baselineGroupAInHorizontal(group);

    return bool;
  }

  // 元素距离
  regular3() {
    const that: any = this;
    // tagShape与mainTxt的距离必须小于24,大于0
    const bool =
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['0'],
        that._matchNodes['2'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['0'],
        that._matchNodes['2'],
        24,
      );

    return bool;
  }

  // 位置关系
  regular4() {
    const that: any = this;
    const bool = Feature.positionAInBCenter(
      that._matchNodes['1'],
      that._matchNodes['0'],
    );

    return bool;
  }

  // 尺寸关系
  regular5() {
    const that: any = this;
    // 1. tagShape一般占mainTxt字高度的大于1/2, 小于1.1
    // 2. 文字长度应超过标签长度的一半
    const bool =
      Feature.sizeHeightRatioAGreatB(
        that._matchNodes['0'],
        that._matchNodes['2'],
        0.5,
      ) &&
      Feature.sizeHeightRatioALessB(
        that._matchNodes['0'],
        that._matchNodes['2'],
        1.1,
      ) &&
      Feature.sizeWidthRatioAGreatB(
        that._matchNodes['1'],
        that._matchNodes['0'],
        0.5,
      );

    return bool;
  }
}

export default EM3M7;
