// (2节点元素) 上icon下text的图标说明设计
// (QImage + QText)
//
// 判断标准
// 1, icon在文字上方,
// 2, icon和文字位于垂直轴上
// 3, icon和文字的间距大于0小于文字高度
// 4, 文字的长度不大于标准icon长度(80)
// 5, 文字的长度不小于icon的长度的一半
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import { text } from 'body-parser';

class WG2M1 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg2-m1', 1, 1, Common.LvA, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    let texts: any = this.getTextNodes();
    let icons: any = this.getImageNodes();

    this._matchNodes['0'] = texts[0];
    this._matchNodes['1'] = icons[0];
  }

  regular1() {
    let bool: boolean =
      Feature.sizeWidthLess(this._matchNodes['1'], Common.IconSize) &&
      Feature.sizeHeightLess(this._matchNodes['1'], Common.IconSize);
    return bool;
  }
  // 1.
  regular2() {
    let bool: boolean = Feature.directionAtopToB(
      this._matchNodes['1'],
      this._matchNodes['0'],
    );
    return bool;
  }
  // 2.
  regular3() {
    let bool: boolean = Feature.baselineABInVertical(
      this._matchNodes['1'],
      this._matchNodes['0'],
    );
    return bool;
  }
  // 3
  regular4() {
    let txtHeight: number = this._matchNodes['0'].height * 1.05;

    let bool: boolean =
      Feature.distanceGreatAbottomToBtop(
        this._matchNodes['1'],
        this._matchNodes['0'],
        -4,
      ) &&
      Feature.distanceLessAbottomToBtop(
        this._matchNodes['1'],
        this._matchNodes['0'],
        txtHeight,
      );
    return bool;
  }
  // 4
  regular5() {
    //let bool: boolean = Feature.sizeWidthRatioALessB(this._matchNodes['0'], this._matchNodes['1'], 1.2);
    let bool: boolean = Feature.sizeWidthLess(this._matchNodes['0'], 80 * 1.1);
    return bool;
  }
  // 5
  regular6() {
    let bool: boolean = Feature.sizeWidthRatioAGreatB(
      this._matchNodes['0'],
      this._matchNodes['1'],
      0.5,
    );
    return bool;
  }
}

export default WG2M1;
