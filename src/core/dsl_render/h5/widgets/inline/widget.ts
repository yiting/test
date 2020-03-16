import Dictionary from '../../../../dsl_helper/dictionary';
import Store from '../../../../dsl_helper/store';
import Methods from '../../../../dsl_helper/methods';
import TextModel from '../../../../dsl_model/models/text';

const H_SPACE = 20; // 水平间距
const V_HEIGHT = 50; // 垂直高度要求
let ErrorCoefficient: number;
let CoordinateWidth: number;

class Inline extends TextModel {
  constructor(node: any = {}) {
    super(node);
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }
  static define() {}
  static capture(nodes: any[]): any[] {
    ErrorCoefficient = Store.get('errorCoefficient') || 0;
    CoordinateWidth = Store.get('coordinateWidth');
    let groups = calInline(nodes);
    let res = groups.filter((col: any) => col.length > 1);
    return res;
  }
  public isSimilarWith(target: any) {
    let meta = Methods.filterAbsNode(this.children);
    let targ = Methods.filterAbsNode(target.children);
    let leng = meta.length;
    if (meta.length != targ.length) {
      return false;
    }
    for (let i = 0; i < leng; i++) {
      let a = meta[i],
        b = targ[i];
      return a.isSimilarWith(b);
    }
  }
}
function calInline(nodes: any) {
  return Methods.gatherByLogic(nodes, (meta: any, target: any) => {
    let max =
      Math.max(meta.maxFontSize, target.maxFontSize) * 2 ||
      Math.min(meta.height, target.height) * 2;
    // 允许横向最大间距
    let gapAllowed = Math.min(
      meta.minFontSize || V_HEIGHT,
      target.minFontSize || V_HEIGHT,
    );
    return (
      meta.height < V_HEIGHT &&
      target.height < V_HEIGHT && // 中线对齐
      (Math.abs(meta.abY + meta.abYops - target.abY - target.abYops) <
        ErrorCoefficient ||
        // 底对齐
        Math.abs(meta.abYops - target.abYops) < ErrorCoefficient) &&
      meta.height < max &&
      target.height < max &&
      Methods.isXConnect(meta, target, gapAllowed) &&
      !Methods.isXConnect(meta, target, -gapAllowed)
    );
  });
}
export default Inline;
