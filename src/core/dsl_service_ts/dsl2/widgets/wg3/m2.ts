// (3节点元素) 上image下两text的设计图标带text设计
// (QImage + QText + QText)
//
// 判断标准
// 1, image位于text的上边
// 2, image与两text位于垂直轴
// 3, image与上text距离大于0小于text高
// 4, 两text上下距离大于0小于下text高
// 5, 两text其中之一的长度必须大于图片长度1半,text长度必须小于图标长度
// 6, image下边距到文字底边的高度与图片的高度比必须大于0.5小于1
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class WG3M2 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg3-m2', 2, 1, Common.LvA, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    let texts: any = this.getTextNodes();
    let images: any = this.getImageNodes();
    Utils.sortListByParam(texts, 'abY', false);

    this._matchNodes['0'] = texts[0];
    this._matchNodes['1'] = texts[1];
    this._matchNodes['2'] = images[0];
  }

  // 1.
  regular1() {
    let bool: boolean =
      Feature.directionAtopToB(this._matchNodes['2'], this._matchNodes['0']) &&
      Feature.directionAtopToB(this._matchNodes['2'], this._matchNodes['1']);
    return bool;
  }

  // 2.
  regular2() {
    let gA: any = [
      this._matchNodes['0'],
      this._matchNodes['1'],
      this._matchNodes['2'],
    ];
    let bool: boolean = Feature.baselineGroupAInVertical(gA);
    return bool;
  }

  // 3.
  regular3() {
    let txtHeight: number = this._matchNodes['0'].height * 1.05; // 1.05系数修正系数

    let bool: boolean =
      Feature.distanceGreatAbottomToBtop(
        this._matchNodes['2'],
        this._matchNodes['0'],
        -4,
      ) &&
      Feature.distanceLessAbottomToBtop(
        this._matchNodes['2'],
        this._matchNodes['0'],
        txtHeight,
      );
    return bool;
  }

  // 4.
  regular4() {
    let txtHeight: number = this._matchNodes['1'].height * 1.05; // 文字间距离修正系数

    let bool: boolean =
      Feature.distanceGreatAbottomToBtop(
        this._matchNodes['0'],
        this._matchNodes['1'],
        -4,
      ) &&
      Feature.distanceLessAbottomToBtop(
        this._matchNodes['0'],
        this._matchNodes['1'],
        txtHeight,
      );
    return bool;
  }

  // 5.
  regular5() {
    let imgW = this._matchNodes['2'].height;

    let b1: boolean =
      Feature.sizeWidthGreat(this._matchNodes['0'], imgW / 2) ||
      Feature.sizeWidthGreat(this._matchNodes['1'], imgW / 2);

    let b2: boolean =
      Feature.sizeWidthLess(this._matchNodes['0'], imgW * 1.05) &&
      Feature.sizeWidthLess(this._matchNodes['1'], imgW * 1.05);

    return b1 && b2;
  }

  // 6.
  regular6() {
    let imgTxtHeight: number = Math.abs(
      this._matchNodes['2'].abYops - this._matchNodes['1'].abYops,
    );
    let rate: number = imgTxtHeight / this._matchNodes['2'].height;

    return rate >= 0.5 && rate <= 1;
  }
}

export default WG3M2;
