// (3节点元素)左QImage右二QText
//
// (QImage) + (QText) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class WG3M2 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg3-m2', 2, 0, 1, 0, Common.LvS, Common.QWidget);

    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  _initNode() {
    const texts: any = this.getTextNodes();
    const images: any = this.getImageNodes();
    const that: any = this;
    Utils.sortListByParam(texts, 'abY', false);

    const imagesIndex0 = 0;
    that._matchNodes['0'] = images[imagesIndex0]; // 图片
    const textsIndex0 = 0;
    that._matchNodes['1'] = texts[textsIndex0]; // 文本1
    const textsIndex1 = 1;
    that._matchNodes['2'] = texts[textsIndex1]; // 文本2
  }

  // 元素方向
  regular1() {
    const that: any = this;
    // image位于二文字左侧
    const bool =
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['1']) &&
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['2']);

    return bool;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // 图片与二文字行位于水平轴
    const bool =
      Feature.baselineABInHorizontal(
        that._matchNodes['0'],
        that._matchNodes['1'],
      ) &&
      Feature.baselineABInHorizontal(
        that._matchNodes['0'],
        that._matchNodes['2'],
      );

    return bool;
  }

  regular3() {
    const that: any = this;
    // 二个文字位于垂直轴
    const bool = Feature.baselineGroupAInVertical([
      that._matchNodes['1'],
      that._matchNodes['2'],
    ]);

    return bool;
  }

  // 元素距离
  regular4() {
    const that: any = this;
    // image与三个文字的距离大于0, 小于44
    const bool =
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['0'],
        that._matchNodes['1'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['0'],
        that._matchNodes['1'],
        44,
      ) &&
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['0'],
        that._matchNodes['2'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['0'],
        that._matchNodes['2'],
        44,
      );

    return bool;
  }
}

export default WG3M2;
