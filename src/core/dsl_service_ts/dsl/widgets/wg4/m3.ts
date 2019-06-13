// (4节点元素)左三张图右一文字
//
// (QImage) + (QImage) + (QImage) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class WG4M3 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg4-m3', 1, 0, 3, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  _initNode() {
    const texts: any = this.getTextNodes();
    const images: any = this.getImageNodes();
    // 排序image
    Utils.sortListByParam(images, 'abX', false);
    const that: any = this;
    const imagesIndex0 = 0;
    that._matchNodes['0'] = images[imagesIndex0]; // 图片1
    const imagesIndex1 = 1;
    that._matchNodes['1'] = images[imagesIndex1]; // 图片2
    const imagesIndex2 = 2;
    that._matchNodes['2'] = images[imagesIndex2]; // 图片3

    const textsIndex0 = 0;
    that._matchNodes['3'] = texts[textsIndex0]; // 文本1
  }

  // 元素方向
  regular1() {
    const that: any = this;
    // 3个图片位于1个文字左边
    const images = [
      that._matchNodes['0'],
      that._matchNodes['1'],
      that._matchNodes['2'],
    ];
    const texts = [that._matchNodes['3']];
    const bool = Feature.directionGroupAleftToGroupB(images, texts);

    return bool;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // 3个图片元素位于水平轴
    const images = [
      that._matchNodes['0'],
      that._matchNodes['1'],
      that._matchNodes['2'],
    ];
    const bool = Feature.baselineGroupAInHorizontal(images);

    return bool;
  }

  // 水平轴方向
  regular3() {
    const that: any = this;
    const images = [
      that._matchNodes['0'],
      that._matchNodes['1'],
      that._matchNodes['2'],
    ];
    const bool = Feature.baselineGroupAcontainBInHorizontal(
      images,
      that._matchNodes['3'],
    );

    return bool;
  }

  // 元素距离
  regular4() {
    const that: any = this;
    // image之间的间距大于等于0, 44
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
        that._matchNodes['1'],
        that._matchNodes['2'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['1'],
        that._matchNodes['2'],
        44,
      );

    return bool;
  }

  // 元素距离
  regular5() {
    const that: any = this;
    // 文字与图片之间的距离
    const bool =
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['2'],
        that._matchNodes['3'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['2'],
        that._matchNodes['3'],
        44,
      );

    return bool;
  }
}

export default WG4M3;
