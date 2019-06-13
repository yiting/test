// (5节点元素)左三张图右两文字
//
// (QImage) + (QImage) + (QImage) + (QText) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class WG5M1 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg5-m1', 1, 0, 3, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;

    const that: any = this;
    // 节点记录
    that._images = null; // 所有的图片
    that._texts = null; // 所有的txt
  }

  _initNode() {
    const that: any = this;
    // 3个图片元素
    that._images = that.getImageNodes();
    // 2个文字元素
    that._texts = that.getTextNodes();
  }

  // 元素方向
  regular1() {
    const that: any = this;
    // 3个图片位于2个文字左边
    return Feature.directionGroupAleftToGroupB(that._images, that._texts);
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // 3个图片元素位于水平轴
    return Feature.baselineGroupAInHorizontal(that._images);
  }

  regular3() {
    const that: any = this;
    // 2个文字元素位于垂直轴
    return Feature.baselineGroupAInVertical(that._texts);
  }

  regular4() {
    const that: any = this;
    // 图片组分别与2个文字相交
    return Feature.baselineGroupABInHorizontal(that._images, that._texts);
  }

  regular5() {
    const that: any = this;
    // console.log(that._texts[0].abY);
    // console.log(that._texts[1].abY);
    // return true;
    return Feature.baselineGroupAcontainBInHorizontal(
      that._images,
      that._texts[0],
    );
    // && feature.baselineGroupAcontainBInHorizontal(that._images, that._texts[1]);
  }

  // 元素距离
  regular6() {
    const that: any = this;
    // 组A与组B的的距离大于0, 小于100
    return (
      Feature.distanceGreatGroupABInHorizontal(that._images, that._texts, 0) &&
      Feature.distanceLessGroupABInHorizontal(that._images, that._texts, 100)
    );
  }
}

export default WG5M1;
