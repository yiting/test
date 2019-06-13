// (4节点元素)左QImage右三QText
//
// (QImage) + (QText) + (QText) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class WG4M1 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg4-m1', 3, 0, 1, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  // 匹配到的节点做记录
  _initNode() {
    const that: any = this;
    const imagesIndex0 = 0;
    that._matchNodes['0'] = that.getImageNodes()[imagesIndex0]; // 图片
    const texts: any = that.getTextNodes();
    // 排序text
    Utils.sortListByParam(texts, 'abY', false);

    const textsIndex0 = 0;
    that._matchNodes['1'] = texts[textsIndex0]; // 文本1
    const textsIndex1 = 1;
    that._matchNodes['2'] = texts[textsIndex1]; // 文本2
    const textsIndex2 = 2;
    that._matchNodes['3'] = texts[textsIndex2]; // 文本3
  }

  // 元素方向
  regular1() {
    const that: any = this;
    // image位于三文字左侧
    const bool =
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['1']) &&
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['2']) &&
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['3']);

    return bool;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // 图片与三文字行位于水平轴
    const bool =
      Feature.baselineABInHorizontal(
        that._matchNodes['0'],
        that._matchNodes['1'],
      ) &&
      Feature.baselineABInHorizontal(
        that._matchNodes['0'],
        that._matchNodes['2'],
      ) &&
      Feature.baselineABInHorizontal(
        that._matchNodes['0'],
        that._matchNodes['3'],
      );

    return bool;
  }

  regular3() {
    const that: any = this;
    // 三个文字位于垂直轴
    const bool = Feature.baselineGroupAInVertical([
      that._matchNodes['1'],
      that._matchNodes['2'],
      that._matchNodes['3'],
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
      ) &&
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['0'],
        that._matchNodes['3'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['0'],
        that._matchNodes['3'],
        44,
      );

    return bool;
  }
}

export default WG4M1;
