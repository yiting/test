import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import Store from '../../../dsl_service_ts/helper/store';
import Methods from '../../../dsl_service_ts/helper/methods';
class Layer extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QLayer;
    this.canLeftFlex = true;
    this.canRightFlex = true;
  }
  static regular(node: any) {
    return node.type == 'QLayer';
  }
  public isSimilarWith(target: any) {
    let ErrorCoefficient = Store.get('errorCoefficient') || 0;
    let a = this,
      b = target;
    // 布局相似
    let isSimilar =
      // 水平中线对齐
      (Math.abs(a.abYops - a.abY - b.abYops + b.abY) < ErrorCoefficient &&
        // 左、中、右对齐
        (Math.abs(a.abX - b.abX) < ErrorCoefficient ||
          Math.abs(a.abXops - b.abXops) < ErrorCoefficient ||
          Math.abs(a.centerAbX - b.centerAbX) < ErrorCoefficient)) ||
      // 垂直中线对齐
      (Math.abs(a.abXops - a.abX - b.abXops + b.abX) < ErrorCoefficient &&
        // 上、中、下对齐
        (Math.abs(a.abY - b.abY) < ErrorCoefficient ||
          Math.abs(a.abYops - b.abYops) < ErrorCoefficient ||
          Math.abs(a.centerAbY - b.centerAbY) < ErrorCoefficient));
    if (isSimilar) {
      let meta = Methods.filterAbsNode(this.children);
      let targ = Methods.filterAbsNode(target.children);
      let leng = meta.length;
      if (meta.length != targ.length) {
        return false;
      }
      for (let i = 0; i < leng; i++) {
        let a = meta[i],
          b = targ[i];
        if (!a.isSimilarWith(b)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}

export default Layer;
