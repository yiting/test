// (3节点元素)上QImage下二QText
//
// (QImage) + (QText) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class WG3M3 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg3-m3', 2, 0, 1, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const texts: any = this.getTextNodes();
    const images: any = this.getImageNodes();
    Utils.sortListByParam(texts, 'abY', false);
    const that: any = this;

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
    // image位于二文字上侧
    const bool =
      Feature.directionAbottomToB(
        that._matchNodes['1'],
        that._matchNodes['0'],
      ) &&
      Feature.directionAbottomToB(that._matchNodes['2'], that._matchNodes['0']);

    return bool;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // 图片与二文字行位于垂直轴
    const bool =
      Feature.baselineABInVertical(
        that._matchNodes['0'],
        that._matchNodes['1'],
      ) &&
      Feature.baselineABInVertical(
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
    // image与文字与文字之间的间距大于0小于44
    const bool =
      Feature.distanceGreatAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        0,
      ) &&
      Feature.distanceLessAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        44,
      ) &&
      Feature.distanceGreatAbottomToBtop(
        that._matchNodes['1'],
        that._matchNodes['2'],
        0,
      ) &&
      Feature.distanceLessAbottomToBtop(
        that._matchNodes['1'],
        that._matchNodes['2'],
        44,
      );

    return bool;
  }

  // 尺寸关系
  regular5() {
    const that: any = this;
    // 文字必须小于图片的长度
    const bool =
      Feature.sizeWidthRatioALessB(
        that._matchNodes['1'],
        that._matchNodes['0'],
        1.1,
      ) &&
      Feature.sizeWidthRatioALessB(
        that._matchNodes['2'],
        that._matchNodes['0'],
        1.1,
      );

    return bool;
  }
}

export default WG3M3;
