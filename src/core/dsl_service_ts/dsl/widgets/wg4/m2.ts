// (4节点元素) 上面三QImage + 下面一Text
//
// ((QImage) + (QImage) + (QImage)) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class WG4M2 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg4-m2', 1, 0, 3, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;
    const that: any = this;

    // 节点记录
    that._matchNodes['0'] = null; // 图片1
    that._matchNodes['1'] = null; // 图片2
    that._matchNodes['2'] = null; // 图片3
    that._matchNodes['3'] = null; // 文本1
  }

  // 匹配到的节点做记录
  _initNode() {
    const that: any = this;
    const images = that.getImageNodes();
    const texts = that.getTextNodes();
    // 横向排列image
    Utils.sortListByParam(images, 'abX', false);

    const imagesIndex0 = 0;
    that._matchNodes['0'] = images[imagesIndex0];
    const imagesIndex1 = 1;
    that._matchNodes['1'] = images[imagesIndex1];
    const imagesIndex2 = 2;
    that._matchNodes['2'] = images[imagesIndex2];
    const textsIndex0 = 0;
    that._matchNodes['3'] = texts[textsIndex0];
  }

  // 元素方向
  regular1() {
    const that: any = this;
    // 文本位于图片下面
    const bool =
      Feature.directionAbottomToB(
        that._matchNodes['3'],
        that._matchNodes['0'],
      ) &&
      Feature.directionAbottomToB(
        that._matchNodes['3'],
        that._matchNodes['1'],
      ) &&
      Feature.directionAbottomToB(that._matchNodes['3'], that._matchNodes['2']);

    return bool;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // 三个图片位于水平轴
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

  regular4() {
    const that: any = this;
    // 文本与image之间的间距大于0, 小于44
    const bool =
      Feature.distanceGreatAtopToBbottom(
        that._matchNodes['3'],
        that._matchNodes['0'],
        0,
      ) &&
      Feature.distanceLessAtopToBbottom(
        that._matchNodes['3'],
        that._matchNodes['0'],
        44,
      ) &&
      Feature.distanceGreatAtopToBbottom(
        that._matchNodes['3'],
        that._matchNodes['1'],
        0,
      ) &&
      Feature.distanceLessAtopToBbottom(
        that._matchNodes['3'],
        that._matchNodes['1'],
        44,
      ) &&
      Feature.distanceGreatAtopToBbottom(
        that._matchNodes['3'],
        that._matchNodes['2'],
        0,
      ) &&
      Feature.distanceLessAtopToBbottom(
        that._matchNodes['3'],
        that._matchNodes['2'],
        44,
      );

    return bool;
  }

  regular5() {
    const that: any = this;
    // 文本必须超过第一张图片的长度 + 间距
    const bool = Feature.sizeWidthRatioAGreatB(
      that._matchNodes['3'],
      that._matchNodes['0'],
      1.25,
    );

    return bool;
  }
}

export default WG4M2;
