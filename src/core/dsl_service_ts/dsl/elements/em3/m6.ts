// (3节点基础元素)左文字 + 右可变长度标签
//
// (QText)-(QImage+QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class EM3M6 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em3-m6', 2, 0, 1, 0, Common.LvS, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  // 区分三个基础元素的逻辑
  _initNode() {
    const texts: any = this.getTextNodes();
    const images: any = this.getImageNodes();
    Utils.sortListByParam(texts, 'abX', false);
    const that: any = this;

    const imagesIndex0 = 0;
    that._matchNodes['1'] = images[imagesIndex0]; // tag的image背景
    const textsIndex1 = 1;
    that._matchNodes['2'] = texts[textsIndex1]; // tag的文字
    const textsIndex0 = 0;
    that._matchNodes['0'] = texts[textsIndex0]; // 主文字
  }

  // 元素方向
  regular1() {
    const that: any = this;

    const bool =
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['2']) &&
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['1']);

    return bool;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;

    // 三者都处于水平轴方向上
    const bool =
      Feature.baselineABInHorizontal(
        that._matchNodes['1'],
        that._matchNodes['0'],
      ) &&
      Feature.baselineABInHorizontal(
        that._matchNodes['1'],
        that._matchNodes['2'],
      ) &&
      Feature.baselineABInHorizontal(
        that._matchNodes['0'],
        that._matchNodes['2'],
      );

    return bool;
  }

  // 元素距离
  regular3() {
    const that: any = this;

    // tagShape与mainTxt的距离必须小于24,大于0
    const bool =
      Feature.distanceGreatAleftToBright(
        that._matchNodes['1'],
        that._matchNodes['0'],
        0,
      ) &&
      Feature.distanceLessAleftToBright(
        that._matchNodes['1'],
        that._matchNodes['0'],
        24,
      );

    return bool;
  }

  // 位置关系
  regular4() {
    const that: any = this;

    // tagTxt在tagShape的里面并且居中
    const bool = Feature.positionAInBCenter(
      that._matchNodes['2'],
      that._matchNodes['1'],
    );

    return bool;
  }

  // 尺寸关系
  regular5() {
    const that: any = this;

    // 1. tagShape一般占mainTxt字高度的大于1/2, 小于1.1
    // 2. tagShape的宽度一般超tagTxt字宽度小于1.2
    const bool =
      Feature.sizeHeightRatioAGreatB(
        that._matchNodes['1'],
        that._matchNodes['0'],
        0.5,
      ) &&
      Feature.sizeHeightRatioALessB(
        that._matchNodes['1'],
        that._matchNodes['0'],
        1.1,
      ) &&
      Feature.sizeWidthRatioAGreatB(
        that._matchNodes['2'],
        that._matchNodes['1'],
        0.5,
      );

    return bool;
  }
}

export default EM3M6;
